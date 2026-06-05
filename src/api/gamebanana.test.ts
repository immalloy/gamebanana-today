import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchRecentFunkinMods } from './gamebanana';

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

function record(id: number, timestamp: number): { _idRow: number; _tsDateAdded: number; _sName: string } {
  return { _idRow: id, _tsDateAdded: timestamp, _sName: `Mod ${id}` };
}

describe('fetchRecentFunkinMods', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stops after the first page with records before the requested day', async () => {
    const today = Math.floor(new Date(2026, 5, 5, 12).getTime() / 1000);
    const yesterday = Math.floor(new Date(2026, 5, 4, 23).getTime() / 1000);
    const pageOne = Array.from({ length: 50 }, (_, index) => record(index + 1, today));
    const pageTwo = [record(51, today), record(52, yesterday)];
    const fetchMock = vi.fn().mockResolvedValueOnce(jsonResponse(pageOne)).mockResolvedValueOnce(jsonResponse(pageTwo));

    vi.stubGlobal('fetch', fetchMock);

    const records = await fetchRecentFunkinMods({ stopBefore: new Date(2026, 5, 5) });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(records).toHaveLength(52);
  });
});
