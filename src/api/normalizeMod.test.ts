import { describe, expect, it } from 'vitest';
import { normalizeMod } from './normalizeMod';

describe('normalizeMod', () => {
  it('normalizes nested GameBanana fields defensively', () => {
    const mod = normalizeMod({
      _idRow: 42,
      _sName: 'Test Mod',
      _tsDateAdded: 1780626559,
      _aSubmitter: { _sName: 'Author', _sProfileUrl: 'https://gamebanana.com/members/1' },
      _aCategory: { _sName: 'Charts' },
      _aRootCategory: { _sName: 'Mod Folders' },
      _aPreviewMedia: {
        _aImages: [{ _sBaseUrl: 'https://images.gamebanana.com/img/ss/mods', _sFile530: '530-test.jpg', _sFile220: '220-test.jpg' }],
      },
      _sText: '<b>Hello</b><br>World',
      _nDownloadCount: 10,
      _nViewCount: 20,
      _nLikeCount: 3,
      _aFiles: [{ _sVersion: '1.0', _sDescription: 'file desc' }],
    });

    expect(mod).toMatchObject({
      id: 42,
      name: 'Test Mod',
      submitterName: 'Author',
      category: 'Charts',
      rootCategory: 'Mod Folders',
      imageUrl: 'https://images.gamebanana.com/img/ss/mods/530-test.jpg',
      thumbnailUrl: 'https://images.gamebanana.com/img/ss/mods/220-test.jpg',
      text: 'Hello World',
      version: '1.0',
    });
  });
});
