import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildGamePageUrl, buildModPageUrl, fetchGamePage } from './gamebanana';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('GameBanana URL builders', () => {
  it('builds mod URLs with arbitrary selected game ids', () => {
    const url = new URL(buildModPageUrl(1234, 3));

    expect(url.origin + url.pathname).toBe('https://gamebanana.com/apiv7/Mod/ByGame');
    expect(url.searchParams.get('_aGameRowIds[]')).toBe('1234');
    expect(url.searchParams.get('_nPage')).toBe('3');
    expect(url.searchParams.get('_nPerpage')).toBe('50');
  });

  it('builds game index URLs with default most-submissions sorting', () => {
    const url = new URL(buildGamePageUrl({ page: 2, name: 'funkin', nameOperator: 'contains' }));

    expect(url.origin + url.pathname).toBe('https://gamebanana.com/apiv11/Game/Index');
    expect(url.searchParams.get('_nPage')).toBe('2');
    expect(url.searchParams.get('_sSort')).toBe('Game_MostSubmissions');
    expect(url.searchParams.get('_sName')).toBe('funkin');
    expect(url.searchParams.get('_sNameOperator')).toBe('contains');
  });

  it('accepts JSON bodies mislabeled as text/html', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ _aRecords: [{ _idRow: 8694, _sName: 'Friday Night Funkin' }] }), {
        status: 200,
        headers: { 'content-type': 'text/html; charset=UTF-8' },
      })),
    );

    await expect(fetchGamePage({ page: 1 })).resolves.toEqual([{ _idRow: 8694, _sName: 'Friday Night Funkin' }]);
  });
});
