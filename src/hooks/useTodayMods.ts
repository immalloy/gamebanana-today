import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchModPage, MODS_PER_PAGE, pageHasOlderRecords } from '../api/gamebanana';
import { normalizeMod } from '../api/normalizeMod';
import { getLocalDayRange, isWithinRange } from '../lib/date';
import type { ModSummary } from '../types/mod';

export interface TodayModsState {
  mods: ModSummary[];
  allLoadedCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  refreshedAt: Date | null;
  dayRange: { start: Date; end: Date };
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
}

export function useTodayMods(): TodayModsState {
  const [mods, setMods] = useState<ModSummary[]>([]);
  const [allLoadedCount, setAllLoadedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const dayRange = useMemo(() => getLocalDayRange(), [refreshToken]);
  const nextPageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const [hasMore, setHasMore] = useState(true);

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
        const records = await fetchModPage(page, controller.signal);
        const normalized = records.flatMap((record) => {
          const mod = normalizeMod(record);
          return mod ? [mod] : [];
        });
        const today = normalized.filter((mod) => isWithinRange(mod.addedAt, dayRange.start, dayRange.end));
        const reachedEnd = records.length < MODS_PER_PAGE || pageHasOlderRecords(records, dayRange.start);

        setMods((current) => {
          if (reset) return today;
          const existingIds = new Set(current.map((mod) => mod.id));
          return [...current, ...today.filter((mod) => !existingIds.has(mod.id))];
        });
        setAllLoadedCount((current) => (reset ? normalized.length : current + normalized.length));
        setRefreshedAt(new Date());
        nextPageRef.current = page + 1;
        hasMoreRef.current = !reachedEnd;
        setHasMore(!reachedEnd);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Failed to load GameBanana mods');
        }
      } finally {
        loadingRef.current = false;
        if (reset) setLoading(false);
        setLoadingMore(false);
      }
    },
    [dayRange.end, dayRange.start],
  );

  useEffect(() => {
    controllerRef.current?.abort();
    nextPageRef.current = 1;
    hasMoreRef.current = true;
    setHasMore(true);
    setMods([]);
    setAllLoadedCount(0);
    loadPage(true);
    return () => controllerRef.current?.abort();
  }, [loadPage]);

  const refresh = useCallback(() => setRefreshToken((value) => value + 1), []);
  const loadMore = useCallback(() => {
    loadPage(false);
  }, [loadPage]);

  return { mods, allLoadedCount, loading, loadingMore, error, refreshedAt, dayRange, hasMore, refresh, loadMore };
}
