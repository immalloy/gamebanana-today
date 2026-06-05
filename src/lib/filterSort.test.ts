import { describe, expect, it } from 'vitest';
import { applyFilters, sortMods } from './filterSort';
import type { ModSummary } from '../types/mod';

function mod(overrides: Partial<ModSummary>): ModSummary {
  return {
    id: 1,
    name: 'Alpha',
    url: 'https://gamebanana.com/mods/1',
    addedAt: new Date(2026, 5, 5, 10),
    addedTimestamp: new Date(2026, 5, 5, 10).getTime(),
    submitterName: 'Maker',
    category: 'Skins',
    rootCategory: 'Mods',
    description: '',
    downloads: 0,
    views: 0,
    likes: 0,
    fileCount: 1,
    ...overrides,
  };
}

describe('mod filtering and sorting', () => {
  const mods = [
    mod({ id: 1, name: 'Alpha Remix', category: 'Skins', downloads: 20, addedTimestamp: 20 }),
    mod({ id: 2, name: 'Beta Chart', category: 'Songs', downloads: 50, addedTimestamp: 10 }),
  ];

  it('filters loaded mods by in-page search and category', () => {
    expect(applyFilters(mods, 'chart', { category: 'Songs' }).map((item) => item.id)).toEqual([2]);
    expect(applyFilters(mods, 'chart', { category: 'Skins' })).toEqual([]);
  });

  it('sorts filtered mods by selected in-page sort mode', () => {
    expect(sortMods(mods, 'downloads').map((item) => item.id)).toEqual([2, 1]);
    expect(sortMods(mods, 'newest').map((item) => item.id)).toEqual([1, 2]);
  });
});
