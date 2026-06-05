import { describe, expect, it } from 'vitest';
import { applyFilters, sortMods } from './filterSort';
import type { FilterState, ModSummary } from '../types/mod';

function mod(overrides: Partial<ModSummary>): ModSummary {
  return {
    id: 1,
    name: 'Base Mod',
    url: 'https://gamebanana.com/mods/1',
    addedAt: new Date('2026-06-05T10:00:00'),
    addedTimestamp: new Date('2026-06-05T10:00:00').getTime(),
    submitterName: 'Submitter',
    category: 'Other/Misc',
    rootCategory: 'Mod Folders',
    description: '',
    downloads: 0,
    views: 0,
    likes: 0,
    fileCount: 1,
    ...overrides,
  };
}

const filters: FilterState = {
  category: 'all',
  compact: false,
};

describe('filterSort', () => {
  it('filters by search and category', () => {
    const mods = [
      mod({ id: 1, name: 'Mario Mix', category: 'Executables', rootCategory: 'Full Game', imageUrl: 'image.jpg', description: 'playable' }),
      mod({ id: 2, name: 'Sonic Chart', category: 'Other/Misc', rootCategory: 'Mod Folders' }),
    ];

    expect(
      applyFilters(mods, 'mario', {
        ...filters,
        category: 'Executables',
      }).map((item) => item.id),
    ).toEqual([1]);
  });

  it('sorts by likes', () => {
    const low = mod({ id: 1, downloads: 1, likes: 0, views: 1 });
    const high = mod({ id: 2, downloads: 1, likes: 2, views: 1 });

    expect(sortMods([low, high], 'likes').map((item) => item.id)).toEqual([2, 1]);
  });
});
