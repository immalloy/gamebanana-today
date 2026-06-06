import { describe, expect, it } from 'vitest';
import { selectHighlights } from './highlights';
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

describe('selectHighlights', () => {
  it('selects top downloaded, liked, and viewed mods', () => {
    const highlights = selectHighlights([
      mod({ id: 1, name: 'Downloads', downloads: 10, views: 1, likes: 1 }),
      mod({ id: 2, name: 'Likes', downloads: 1, views: 1, likes: 10 }),
      mod({ id: 3, name: 'Views', downloads: 1, views: 10, likes: 1 }),
    ]);

    expect(highlights.map((highlight) => [highlight.id, highlight.mod.id])).toEqual([
      ['downloads', 1],
      ['likes', 2],
      ['views', 3],
    ]);
  });

  it('can avoid duplicate highlighted mods', () => {
    const highlights = selectHighlights([
      mod({ id: 1, name: 'All Metrics', downloads: 10, views: 10, likes: 10, addedTimestamp: 20 }),
      mod({ id: 2, name: 'Second', downloads: 5, views: 5, likes: 5, addedTimestamp: 10 }),
      mod({ id: 3, name: 'Third', downloads: 2, views: 2, likes: 2, addedTimestamp: 5 }),
    ], true);

    expect(highlights.map((highlight) => highlight.mod.id)).toEqual([1, 2, 3]);
  });

  it('skips metrics that have no positive value', () => {
    const highlights = selectHighlights([
      mod({ id: 1, downloads: 0, views: 12, likes: 0 }),
      mod({ id: 2, downloads: 0, views: 4, likes: 0 }),
    ]);

    expect(highlights.map((highlight) => highlight.id)).toEqual(['views']);
  });
});
