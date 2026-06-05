import { describe, expect, it } from 'vitest';
import { buildGamePageUrl, buildModPageUrl } from './gamebanana';

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
});
