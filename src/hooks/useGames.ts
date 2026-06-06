import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchGamePage, fetchGameProfilePage, GAMES_PER_PAGE } from '../api/gamebanana';
import { normalizeGame, normalizeGameModCount } from '../api/normalizeGame';
import type { GameFilterState, GameSummary } from '../types/game';

export interface GamesState {
  games: GameSummary[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
}

async function enrichGameCounts(games: GameSummary[], signal: AbortSignal): Promise<GameSummary[]> {
  const enriched = [...games];
  let nextIndex = 0;
  const workerCount = Math.min(4, games.length);

  const workers = Array.from({ length: workerCount }, async () => {
    while (nextIndex < games.length && !signal.aborted) {
      const index = nextIndex;
      nextIndex += 1;
      try {
        const profile = await fetchGameProfilePage(games[index].id, signal);
        const count = normalizeGameModCount(profile);
        if (count !== undefined) {
          enriched[index] = { ...games[index], submissionCount: count };
        }
      } catch (cause) {
        if (signal.aborted) throw cause;
      }
    }
  });

  await Promise.all(workers);
  return enriched;
}

export function useGames(filters: GameFilterState): GamesState {
  const [games, setGames] = useState<GameSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshToken, setRefreshToken] = useState(0);
  const nextPageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const loadPage = useCallback(
    async (reset = false): Promise<void> => {
      if (!reset && loadingRef.current) return;
      if (!reset && !hasMoreRef.current) return;

      if (reset) {
        controllerRef.current?.abort();
        nextPageRef.current = 1;
        hasMoreRef.current = true;
        loadingRef.current = false;
        setHasMore(true);
        setGames([]);
      }

      loadingRef.current = true;
      const controller = new AbortController();
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      controllerRef.current = controller;
      if (reset) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const page = reset ? 1 : nextPageRef.current;
        const records = await fetchGamePage({
          page,
          perPage: GAMES_PER_PAGE,
          sort: filters.sort,
          name: filters.name,
          nameOperator: filters.nameOperator,
          signal: controller.signal,
        });
        const normalizedGames = records.flatMap((record) => {
          const game = normalizeGame(record);
          return game ? [game] : [];
        });
        const normalized = await enrichGameCounts(normalizedGames, controller.signal);
        const reachedEnd = records.length < GAMES_PER_PAGE;
        if (controller.signal.aborted || requestIdRef.current !== requestId) return;

        setGames((current) => {
          if (reset) return normalized;
          const existingIds = new Set(current.map((game) => game.id));
          return [...current, ...normalized.filter((game) => !existingIds.has(game.id))];
        });
        nextPageRef.current = page + 1;
        hasMoreRef.current = !reachedEnd;
        setHasMore(!reachedEnd);
      } catch (cause) {
        if (!controller.signal.aborted && requestIdRef.current === requestId) {
          setError(cause instanceof Error ? cause.message : 'Failed to load GameBanana games');
        }
      } finally {
        if (requestIdRef.current === requestId) {
          loadingRef.current = false;
          if (!controller.signal.aborted) {
            if (reset) setLoading(false);
            setLoadingMore(false);
          }
        }
      }
    },
    [filters.name, filters.nameOperator, filters.sort],
  );

  useEffect(() => {
    loadPage(true);
    return () => controllerRef.current?.abort();
  }, [loadPage, refreshToken]);

  const refresh = useCallback(() => setRefreshToken((value) => value + 1), []);
  const loadMore = useCallback(() => loadPage(false), [loadPage]);

  return { games, loading, loadingMore, error, hasMore, refresh, loadMore };
}
