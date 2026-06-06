import { describe, expect, it } from 'vitest';
import { normalizeGame, normalizeGameModCount } from './normalizeGame';
import { normalizeMod } from './normalizeMod';

describe('normalizers', () => {
  it('normalizes game records with preview media fallbacks', () => {
    expect(normalizeGame({
      _idRow: '42',
      _sName: '  Friday Night Funkin\'  ',
      _sProfileUrl: 'https://gamebanana.com/games/42',
      _aPreviewMedia: {
        _aImages: [
          { _sBaseUrl: 'https://images.example/game', _sFile220: 'small.png' },
          { _sType: 'banner', _sBaseUrl: 'https://images.example/banner', _sFile530: 'banner.png' },
        ],
      },
      _nSubmissionCount: '123',
    })).toEqual({
      id: 42,
      name: 'Friday Night Funkin\'',
      url: 'https://gamebanana.com/games/42',
      imageUrl: 'https://images.example/banner/banner.png',
      submissionCount: 123,
    });
  });

  it('returns null for game records without a numeric id', () => {
    expect(normalizeGame({ _idRow: 'not-an-id' })).toBeNull();
  });

  it('sums profile mod category counts', () => {
    expect(normalizeGameModCount({
      _aModRootCategories: [
        { _sName: 'Skins', _nItemCount: 2 },
        { _sName: 'Executables', _nItemCount: '3' },
      ],
    })).toBe(5);
  });

  it('normalizes mod records and strips HTML descriptions', () => {
    const mod = normalizeMod({
      _idRow: '99',
      _sName: '  Fresh Mod  ',
      _sProfileUrl: 'https://gamebanana.com/mods/99',
      _tsDateAdded: 1_700_000_000,
      _aSubmitter: { _sName: 'Malloy', _sProfileUrl: 'https://gamebanana.com/members/1' },
      _aRootCategory: { _sName: 'Skins' },
      _aCategory: { _sName: 'Boyfriend' },
      _aPreviewMedia: {
        _aImages: [{ _sBaseUrl: 'https://images.example/mod', _sFile530: 'large.png', _sFile220: 'thumb.png' }],
      },
      _sDescription: '<p>Hello&nbsp;<strong>world</strong></p>',
      _nDownloadCount: '12',
      _nViewCount: '34',
      _nLikeCount: '5',
      _aFiles: [{ _sVersion: '1.2.3' }],
    });

    expect(mod).toMatchObject({
      id: 99,
      name: 'Fresh Mod',
      submitterName: 'Malloy',
      category: 'Boyfriend',
      rootCategory: 'Skins',
      categoryPath: 'Skins > Boyfriend',
      imageUrl: 'https://images.example/mod/large.png',
      thumbnailUrl: 'https://images.example/mod/thumb.png',
      description: 'Hello world',
      downloads: 12,
      views: 34,
      likes: 5,
      fileCount: 1,
      version: '1.2.3',
    });
  });

  it('returns null for mod records without a valid id or date', () => {
    expect(normalizeMod({ _idRow: 1 })).toBeNull();
    expect(normalizeMod({ _tsDateAdded: 1_700_000_000 })).toBeNull();
  });
});
