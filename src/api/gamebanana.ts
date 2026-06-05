import type { GameBananaModRecord } from '../types/gamebanana';
import { timestampToDate } from '../lib/date';

const GAME_ID = '8694';
const PER_PAGE = 50;
const MAX_PAGES = 20;
const PROPERTIES = [
  '_idRow',
  '_sName',
  '_aSubmitter',
  '_tsDateAdded',
  '_aRootCategory',
  '_aCategory',
  '_aPreviewMedia',
  '_nLikeCount',
  '_nViewCount',
  '_nDownloadCount',
  '_sDescription',
  '_sText',
  '_sProfileUrl',
  '_aFiles',
].join(',');

function buildUrl(page: number): string {
  const url = new URL('https://gamebanana.com/apiv7/Mod/ByGame');
  url.searchParams.append('_aGameRowIds[]', GAME_ID);
  url.searchParams.set('_nPage', String(page));
  url.searchParams.set('_nPerpage', String(PER_PAGE));
  url.searchParams.set('_csvProperties', PROPERTIES);
  return url.toString();
}

export async function fetchModPage(page: number, signal?: AbortSignal): Promise<GameBananaModRecord[]> {
  const response = await fetch(buildUrl(page), {
    headers: { Accept: 'application/json' },
    signal,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    throw new Error(`GameBanana returned ${response.status}`);
  }
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON from GameBanana, received ${contentType || 'unknown content type'}`);
  }

  const json = await response.json();
  if (Array.isArray(json)) return json as GameBananaModRecord[];
  if (Array.isArray(json?.data)) return json.data as GameBananaModRecord[];
  if (Array.isArray(json?.items)) return json.items as GameBananaModRecord[];
  throw new Error('GameBanana response shape was not recognized');
}

interface FetchRecentOptions {
  signal?: AbortSignal;
  stopBefore?: Date;
}

function containsRecordBefore(records: GameBananaModRecord[], stopBefore: Date): boolean {
  return records.some((record) => {
    const addedAt = timestampToDate(record._tsDateAdded);
    return Boolean(addedAt && addedAt.getTime() < stopBefore.getTime());
  });
}

export async function fetchRecentFunkinMods(options: FetchRecentOptions = {}): Promise<GameBananaModRecord[]> {
  const all: GameBananaModRecord[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const records = await fetchModPage(page, options.signal);
    all.push(...records);
    if (records.length < PER_PAGE || (options.stopBefore && containsRecordBefore(records, options.stopBefore))) break;
  }
  return all;
}
