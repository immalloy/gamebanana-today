import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchModPage, MODS_PER_PAGE, pageHasOlderRecords } from '../api/gamebanana';
import { normalizeMod } from '../api/normalizeMod';
import { getLocalRange, isWithinRange } from '../lib/date';
import type { RangeMode } from '../types/game';
import type { ModSummary } from '../types/mod';

interface UseGameModsOptions {
  gameId: number;
  rangeMode: RangeMode;
}

export interface GameModsState {
  mods: ModSummary[];
  allLoadedCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  refreshedAt: Date | null;
  range: { start: Date; end: Date };
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
}

export function useGameMods({ gameId, rangeMode }: UseGameModsOptions): GameModsState {
  const [mods, setMods] = useState<ModSummary[]>([]);
  const [allLoadedCount, setAllLoadedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const range = useMemo(() => getLocalRange(rangeMode), [rangeMode, refreshToken]);
  const nextPageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const [hasMore, setHasMore] = useState(true);

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
        setMods([]);
        setAllLoadedCount(0);
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
        const records = await fetchModPage(gameId, page, controller.signal);
        const normalized = records.flatMap((record) => {
          const mod = normalizeMod(record);
          return mod ? [mod] : [];
        });
        const inRange = normalized.filter((mod) => isWithinRange(mod.addedAt, range.start, range.end));
        const reachedEnd = records.length < MODS_PER_PAGE || pageHasOlderRecords(records, range.start);
        if (controller.signal.aborted || requestIdRef.current !== requestId) return;

        setMods((current) => {
          if (reset) return inRange;
          const existingIds = new Set(current.map((mod) => mod.id));
          return [...current, ...inRange.filter((mod) => !existingIds.has(mod.id))];
        });
        setAllLoadedCount((current) => (reset ? normalized.length : current + normalized.length));
        setRefreshedAt(new Date());
        nextPageRef.current = page + 1;
        hasMoreRef.current = !reachedEnd;
        setHasMore(!reachedEnd);
      } catch (cause) {
        if (!controller.signal.aborted && requestIdRef.current === requestId) {
          setError(cause instanceof Error ? cause.message : 'Failed to load GameBanana mods');
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
    [gameId, range.end, range.start],
  );

  useEffect(() => {
    loadPage(true);
    return () => controllerRef.current?.abort();
  }, [loadPage]);

  const refresh = useCallback(() => setRefreshToken((value) => value + 1), []);
  const loadMore = useCallback(() => loadPage(false), [loadPage]);

  return { mods, allLoadedCount, loading, loadingMore, error, refreshedAt, range, hasMore, refresh, loadMore };
}
