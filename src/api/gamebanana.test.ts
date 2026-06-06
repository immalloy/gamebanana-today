import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildGamePageUrl,
  buildGameProfileUrl,
  fetchGameProfilePage,
  buildModPageUrl,
  fetchGamePage,
  fetchModPage,
  pageHasOlderRecords,
} from './gamebanana';
import type { GameBananaModRecord } from '../types/gamebanana';

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(body: unknown, ok = true): Response {
  return new Response(JSON.stringify(body), {
    status: ok ? 200 : 500,
    headers: { 'content-type': 'application/json' },
  });
}

describe('GameBanana API helpers', () => {
  it('builds mod page URLs with requested API fields', () => {
    const url = new URL(buildModPageUrl(123, 2));

    expect(url.origin).toBe('https://gamebanana.com');
    expect(url.pathname).toBe('/apiv7/Mod/ByGame');
    expect(url.searchParams.get('_aGameRowIds[]')).toBe('123');
    expect(url.searchParams.get('_nPage')).toBe('2');
    expect(url.searchParams.get('_nPerpage')).toBe('50');
    expect(url.searchParams.get('_csvProperties')).toContain('_aPreviewMedia');
  });

  it('builds game search URLs with trimmed name filters', () => {
    const url = new URL(buildGamePageUrl({
      page: 3,
      perPage: 12,
      sort: 'Game_Name',
      name: '  Funkin  ',
      nameOperator: 'contains',
    }));

    expect(url.pathname).toBe('/apiv11/Game/Index');
    expect(url.searchParams.get('_nPage')).toBe('3');
    expect(url.searchParams.get('_nPerpage')).toBe('12');
    expect(url.searchParams.get('_sSort')).toBe('Game_Name');
    expect(url.searchParams.get('_sName')).toBe('Funkin');
    expect(url.searchParams.get('_sNameOperator')).toBe('contains');
  });

  it('encodes profile URLs safely', () => {
    expect(buildGameProfileUrl('12/34')).toBe('https://gamebanana.com/apiv11/Game/12%2F34/ProfilePage');
  });

  it('reads game records from the apiv11 _aRecords shape', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({ _aRecords: [{ _idRow: 1, _sName: 'Friday Night Funkin\'' }] }));

    await expect(fetchGamePage({ page: 1 })).resolves.toEqual([{ _idRow: 1, _sName: 'Friday Night Funkin\'' }]);
  });

  it('reads mod records from array responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse([{ _idRow: 10, _sName: 'Mod' }]));

    await expect(fetchModPage(1, 1)).resolves.toEqual([{ _idRow: 10, _sName: 'Mod' }]);
  });

  it('parses profile JSON even when GameBanana reports a text/html content type', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ _idRow: 8694, _sName: 'Friday Night Funkin\'' }), {
      status: 200,
      headers: { 'content-type': 'text/html; charset=UTF-8' },
    }));

    await expect(fetchGameProfilePage(8694)).resolves.toEqual({ _idRow: 8694, _sName: 'Friday Night Funkin\'' });
  });

  it('detects records older than the requested cutoff', () => {
    const records: GameBananaModRecord[] = [
      { _idRow: 1, _tsDateAdded: 1_700_000_000 },
      { _idRow: 2, _tsDateAdded: 1_800_000_000 },
    ];

    expect(pageHasOlderRecords(records, new Date(1_750_000_000 * 1000))).toBe(true);
    expect(pageHasOlderRecords(records, new Date(1_600_000_000 * 1000))).toBe(false);
  });
});
