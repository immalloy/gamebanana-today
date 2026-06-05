import type { FilterState, ModSummary, SortMode } from '../types/mod';

export function getLocalScore(mod: ModSummary): number {
  return mod.downloads * 4 + mod.likes * 12 + mod.views + (mod.imageUrl ? 20 : 0) + (mod.description || mod.text ? 10 : 0);
}

export function matchesSearch(mod: ModSummary, query: string): boolean {
  const value = query.trim().toLowerCase();
  if (!value) return true;
  return [mod.name, mod.submitterName, mod.category, mod.rootCategory, mod.description, mod.text]
    .join(' ')
    .toLowerCase()
    .includes(value);
}

export function applyFilters(mods: ModSummary[], query: string, filters: FilterState): ModSummary[] {
  return mods.filter((mod) => {
    if (!matchesSearch(mod, query)) return false;
    if (filters.category !== 'all' && mod.category !== filters.category) return false;
    if (filters.rootCategory !== 'all' && mod.rootCategory !== filters.rootCategory) return false;
    if (filters.onlyWithImages && !mod.imageUrl) return false;
    if (filters.onlyWithDescription && !(mod.description || mod.text)) return false;
    return true;
  });
}

export function sortMods(mods: ModSummary[], sortMode: SortMode): ModSummary[] {
  const sorted = [...mods];
  sorted.sort((a, b) => {
    if (sortMode === 'oldest') return a.addedTimestamp - b.addedTimestamp;
    if (sortMode === 'downloads') return b.downloads - a.downloads || b.addedTimestamp - a.addedTimestamp;
    if (sortMode === 'views') return b.views - a.views || b.addedTimestamp - a.addedTimestamp;
    if (sortMode === 'likes') return b.likes - a.likes || b.addedTimestamp - a.addedTimestamp;
    if (sortMode === 'score') return getLocalScore(b) - getLocalScore(a) || b.addedTimestamp - a.addedTimestamp;
    return b.addedTimestamp - a.addedTimestamp;
  });
  return sorted;
}

export function getOptionValues(mods: ModSummary[], key: 'category' | 'rootCategory'): string[] {
  return Array.from(new Set(mods.map((mod) => mod[key]).filter(Boolean))).sort((a, b) => a.localeCompare(b));
}
