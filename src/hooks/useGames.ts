import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchGamePage, GAMES_PER_PAGE } from '../api/gamebanana';
import { normalizeGame } from '../api/normalizeGame';
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

  const loadPage = useCallback(
    async (reset = false): Promise<void> => {
      if (loadingRef.current) return;
      if (!reset && !hasMoreRef.current) return;

      loadingRef.current = true;
      const controller = new AbortController();
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
        const normalized = records.flatMap((record) => {
          const game = normalizeGame(record);
          return game ? [game] : [];
        });
        const reachedEnd = records.length < GAMES_PER_PAGE;

        setGames((current) => {
          if (reset) return normalized;
          const existingIds = new Set(current.map((game) => game.id));
          return [...current, ...normalized.filter((game) => !existingIds.has(game.id))];
        });
        nextPageRef.current = page + 1;
        hasMoreRef.current = !reachedEnd;
        setHasMore(!reachedEnd);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Failed to load GameBanana games');
        }
      } finally {
        loadingRef.current = false;
        if (reset) setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters.name, filters.nameOperator, filters.sort],
  );

  useEffect(() => {
    controllerRef.current?.abort();
    nextPageRef.current = 1;
    hasMoreRef.current = true;
    setHasMore(true);
    setGames([]);
    loadPage(true);
    return () => controllerRef.current?.abort();
  }, [loadPage, refreshToken]);

  const refresh = useCallback(() => setRefreshToken((value) => value + 1), []);
  const loadMore = useCallback(() => loadPage(false), [loadPage]);

  return { games, loading, loadingMore, error, hasMore, refresh, loadMore };
}
