import { describe, expect, it } from 'vitest';
import { applyFilters, categoryLabel, getCategoryOptions, matchesSearch, sortMods } from './filterSort';
import type { ModSummary } from '../types/mod';

function mod(overrides: Partial<ModSummary>): ModSummary {
  return {
    id: 1,
    name: 'Base Mod',
    url: 'https://gamebanana.com/mods/1',
    addedAt: new Date(0),
    addedTimestamp: 0,
    submitterName: 'Submitter',
    category: 'General',
    rootCategory: 'Other',
    categoryPath: 'Other > General',
    description: '',
    downloads: 0,
    views: 0,
    likes: 0,
    fileCount: 0,
    ...overrides,
  };
}

describe('filter and sort helpers', () => {
  const mods = [
    mod({ id: 1, name: 'Fresh Skin', rootCategory: 'Skins', category: 'Boyfriend', categoryPath: 'Skins > Boyfriend', addedTimestamp: 30, downloads: 1, views: 5, likes: 0 }),
    mod({ id: 2, name: 'Hot Song', rootCategory: 'Audio', category: 'Songs', categoryPath: 'Audio > Songs', addedTimestamp: 20, downloads: 10, views: 2, likes: 3 }),
    mod({ id: 3, name: 'Old Skin', rootCategory: 'Skins', category: 'Girlfriend', categoryPath: 'Skins > Girlfriend', addedTimestamp: 10, downloads: 10, views: 8, likes: 1 }),
  ];

  it('matches search across visible mod text', () => {
    expect(matchesSearch(mods[0], 'boyfriend')).toBe(true);
    expect(matchesSearch(mods[0], 'missing')).toBe(false);
    expect(matchesSearch(mods[0], '   ')).toBe(true);
  });

  it('filters by root categories and category paths', () => {
    expect(applyFilters(mods, '', { category: 'Skins' }).map((item) => item.id)).toEqual([1, 3]);
    expect(applyFilters(mods, '', { category: 'Skins > Girlfriend' }).map((item) => item.id)).toEqual([3]);
    expect(applyFilters(mods, 'song', { category: 'all' }).map((item) => item.id)).toEqual([2]);
  });

  it('sorts by selected metrics with newest tie-breaks', () => {
    expect(sortMods(mods, 'newest').map((item) => item.id)).toEqual([1, 2, 3]);
    expect(sortMods(mods, 'oldest').map((item) => item.id)).toEqual([3, 2, 1]);
    expect(sortMods(mods, 'downloads').map((item) => item.id)).toEqual([2, 3, 1]);
    expect(sortMods(mods, 'views').map((item) => item.id)).toEqual([3, 1, 2]);
    expect(sortMods(mods, 'likes').map((item) => item.id)).toEqual([2, 3, 1]);
  });

  it('builds grouped category options and labels', () => {
    expect(getCategoryOptions(mods)).toEqual(['Audio', 'Audio > Songs', 'Skins', 'Skins > Boyfriend', 'Skins > Girlfriend']);
    expect(categoryLabel('Skins > Boyfriend')).toBe('Boyfriend');
  });
});
