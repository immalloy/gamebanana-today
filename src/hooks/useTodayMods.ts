import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchRecentFunkinMods } from '../api/gamebanana';
import { normalizeMod } from '../api/normalizeMod';
import { getLocalDayRange, isWithinRange } from '../lib/date';
import type { ModSummary } from '../types/mod';

export interface TodayModsState {
  mods: ModSummary[];
  allLoadedCount: number;
  loading: boolean;
  error: string | null;
  refreshedAt: Date | null;
  dayRange: { start: Date; end: Date };
  refresh: () => void;
}

export function useTodayMods(): TodayModsState {
  const [mods, setMods] = useState<ModSummary[]>([]);
  const [allLoadedCount, setAllLoadedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const dayRange = useMemo(() => getLocalDayRange(), [refreshToken]);

  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    async function load(): Promise<void> {
      setLoading(true);
      setError(null);
      try {
        const records = await fetchRecentFunkinMods(controller.signal);
        const normalized = records.flatMap((record) => {
          const mod = normalizeMod(record);
          return mod ? [mod] : [];
        });
        const today = normalized.filter((mod) => isWithinRange(mod.addedAt, dayRange.start, dayRange.end));
        if (!ignore) {
          setAllLoadedCount(normalized.length);
          setMods(today);
          setRefreshedAt(new Date());
        }
      } catch (cause) {
        if (!ignore && !controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : 'Failed to load GameBanana mods');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [dayRange.end, dayRange.start, refreshToken]);

  const refresh = useCallback(() => setRefreshToken((value) => value + 1), []);

  return { mods, allLoadedCount, loading, error, refreshedAt, dayRange, refresh };
}
