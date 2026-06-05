import { describe, expect, it } from 'vitest';
import { selectHighlights } from './highlights';
import type { ModSummary } from '../types/mod';

function mod(id: number, overrides: Partial<ModSummary>): ModSummary {
  return {
    id,
    name: `Mod ${id}`,
    url: `https://gamebanana.com/mods/${id}`,
    addedAt: new Date(1780620000000 + id),
    addedTimestamp: 1780620000000 + id,
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

describe('selectHighlights', () => {
  it('avoids duplicate picks while enough candidates exist', () => {
    const highlights = selectHighlights([
      mod(1, { downloads: 100 }),
      mod(2, { likes: 100 }),
      mod(3, { views: 100 }),
      mod(4, { downloads: 1, likes: 1, views: 1, imageUrl: 'image.jpg' }),
      mod(5, { addedTimestamp: 9999999999999 }),
    ]);

    expect(new Set(highlights.map((highlight) => highlight.mod.id)).size).toBe(highlights.length);
  });

  it('allows duplicates when there are fewer mods than slots', () => {
    const highlights = selectHighlights([mod(1, { downloads: 5 })]);

    expect(highlights).toHaveLength(3);
    expect(new Set(highlights.map((highlight) => highlight.mod.id))).toEqual(new Set([1]));
  });
});
