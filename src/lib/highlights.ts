import type { ModSummary } from '../types/mod';

export interface Highlight {
  id: string;
  label: string;
  mod: ModSummary;
}

function pickBest(candidates: ModSummary[], compare: (a: ModSummary, b: ModSummary) => number): ModSummary | undefined {
  return [...candidates].sort(compare)[0];
}

export function selectHighlights(mods: ModSummary[], noDuplicates = false): Highlight[] {
  if (mods.length === 0) return [];

  const used = new Set<number>();
  const choose = (label: string, id: string, compare: (a: ModSummary, b: ModSummary) => number): Highlight | null => {
    const pool = noDuplicates ? mods.filter((mod) => !used.has(mod.id)) : mods;
    const mod = pickBest(pool.length ? pool : mods, compare);
    if (!mod) return null;
    used.add(mod.id);
    return { id, label, mod };
  };

  return [
    choose('Most downloaded', 'downloads', (a, b) => b.downloads - a.downloads || b.addedTimestamp - a.addedTimestamp),
    choose('Most liked', 'likes', (a, b) => b.likes - a.likes || b.addedTimestamp - a.addedTimestamp),
    choose('Most viewed', 'views', (a, b) => b.views - a.views || b.addedTimestamp - a.addedTimestamp),
  ].filter((highlight): highlight is Highlight => Boolean(highlight));
}
