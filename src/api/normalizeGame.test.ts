import { describe, expect, it } from 'vitest';
import { normalizeGame } from './normalizeGame';

describe('normalizeGame', () => {
  it('normalizes GameBanana game records with preview media', () => {
    const game = normalizeGame({
      _idRow: '8694',
      _sName: 'Friday Night Funkin',
      _sProfileUrl: 'https://gamebanana.com/games/8694',
      _nSubmitCount: '12345',
      _aPreviewMedia: {
        _aImages: [
          {
            _sBaseUrl: 'https://images.gamebanana.com/img/ss/games',
            _sFile220: 'fnf.jpg',
          },
        ],
      },
    });

    expect(game).toEqual({
      id: 8694,
      name: 'Friday Night Funkin',
      url: 'https://gamebanana.com/games/8694',
      imageUrl: 'https://images.gamebanana.com/img/ss/games/fnf.jpg',
      submissionCount: 12345,
    });
  });

  it('prefers GameBanana banner URLs when records include direct image URLs', () => {
    const game = normalizeGame({
      _idRow: 2,
      _sName: 'Counter-Strike: Source',
      _aPreviewMedia: {
        _aImages: [
          { _sType: 'icon', _sUrl: 'https://images.gamebanana.com/icon.png' },
          { _sType: 'banner', _sUrl: 'https://images.gamebanana.com/banner.jpg' },
        ],
      },
    });

    expect(game?.imageUrl).toBe('https://images.gamebanana.com/banner.jpg');
  });

  it('returns null for records without a numeric id', () => {
    expect(normalizeGame({ _sName: 'Missing ID' })).toBeNull();
  });
});
