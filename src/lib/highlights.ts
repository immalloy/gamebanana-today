import type { ModSummary } from '../types/mod';

export interface Highlight {
  id: string;
  label: string;
  mod: ModSummary;
  value: string;
}

function pickBest(candidates: ModSummary[], compare: (a: ModSummary, b: ModSummary) => number): ModSummary | undefined {
  return [...candidates].sort(compare)[0];
}

export function selectHighlights(mods: ModSummary[]): Highlight[] {
  if (mods.length === 0) return [];

  const used = new Set<number>();
  const choose = (label: string, id: string, value: (mod: ModSummary) => string, compare: (a: ModSummary, b: ModSummary) => number): Highlight | null => {
    const remaining = mods.filter((mod) => !used.has(mod.id));
    const pool = remaining.length ? remaining : mods;
    const mod = pickBest(pool, compare);
    if (!mod) return null;
    used.add(mod.id);
    return { id, label, mod, value: value(mod) };
  };

  return [
    choose('Most downloaded', 'downloads', (mod) => `${mod.downloads.toLocaleString()} downloads`, (a, b) => b.downloads - a.downloads || b.addedTimestamp - a.addedTimestamp),
    choose('Most liked', 'likes', (mod) => `${mod.likes.toLocaleString()} likes`, (a, b) => b.likes - a.likes || b.addedTimestamp - a.addedTimestamp),
    choose('Most viewed', 'views', (mod) => `${mod.views.toLocaleString()} views`, (a, b) => b.views - a.views || b.addedTimestamp - a.addedTimestamp),
  ].filter((highlight): highlight is Highlight => Boolean(highlight));
}
