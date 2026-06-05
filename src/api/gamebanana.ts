import type { GameBananaGameRecord, GameBananaModRecord } from '../types/gamebanana';
import { timestampToDate } from '../lib/date';
import type { GameNameOperator, GameSortMode } from '../types/game';

export const MODS_PER_PAGE = 50;
export const GAMES_PER_PAGE = 36;
const MAX_PAGES = 20;
const MOD_PROPERTIES = [
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
  '_sProfileUrl',
  '_aFiles',
].join(',');
const GAME_PROPERTIES = [
  '_idRow',
  '_sName',
  '_sProfileUrl',
  '_sIconUrl',
  '_sBannerUrl',
  '_sImageUrl',
  '_nSubmitCount',
  '_nSubmissionCount',
  '_nModCount',
  '_aPreviewMedia',
].join(',');

export function buildModPageUrl(gameId: number | string, page: number): string {
  const url = new URL('https://gamebanana.com/apiv7/Mod/ByGame');
  url.searchParams.append('_aGameRowIds[]', String(gameId));
  url.searchParams.set('_nPage', String(page));
  url.searchParams.set('_nPerpage', String(MODS_PER_PAGE));
  url.searchParams.set('_csvProperties', MOD_PROPERTIES);
  return url.toString();
}

export async function fetchModPage(gameId: number | string, page: number, signal?: AbortSignal): Promise<GameBananaModRecord[]> {
  const response = await fetch(buildModPageUrl(gameId, page), {
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

export interface FetchGamePageOptions {
  page: number;
  perPage?: number;
  sort?: GameSortMode;
  name?: string;
  nameOperator?: GameNameOperator;
  signal?: AbortSignal;
}

export function buildGamePageUrl(options: Omit<FetchGamePageOptions, 'signal'>): string {
  const url = new URL('https://gamebanana.com/apiv11/Game/Index');
  url.searchParams.set('_nPage', String(options.page));
  url.searchParams.set('_nPerpage', String(options.perPage ?? GAMES_PER_PAGE));
  url.searchParams.set('_sSort', options.sort ?? 'Game_MostSubmissions');
  url.searchParams.set('_csvProperties', GAME_PROPERTIES);

  const name = options.name?.trim();
  if (name) {
    url.searchParams.set('_sName', name);
    url.searchParams.set('_sNameOperator', options.nameOperator ?? 'contains');
  }

  return url.toString();
}

export async function fetchGamePage(options: FetchGamePageOptions): Promise<GameBananaGameRecord[]> {
  const response = await fetch(buildGamePageUrl(options), {
    headers: { Accept: 'application/json' },
    signal: options.signal,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!response.ok) {
    throw new Error(`GameBanana returned ${response.status}`);
  }
  if (!contentType.includes('application/json')) {
    throw new Error(`Expected JSON from GameBanana, received ${contentType || 'unknown content type'}`);
  }

  const json = await response.json();
  if (Array.isArray(json)) return json as GameBananaGameRecord[];
  if (Array.isArray(json?._aRecords)) return json._aRecords as GameBananaGameRecord[];
  if (Array.isArray(json?.data)) return json.data as GameBananaGameRecord[];
  if (Array.isArray(json?.items)) return json.items as GameBananaGameRecord[];
  if (Array.isArray(json?.records)) return json.records as GameBananaGameRecord[];
  throw new Error('GameBanana response shape was not recognized');
}

interface FetchRecentOptions {
  gameId: number | string;
  signal?: AbortSignal;
  stopBefore?: Date;
}

function containsRecordBefore(records: GameBananaModRecord[], stopBefore: Date): boolean {
  return records.some((record) => {
    const addedAt = timestampToDate(record._tsDateAdded);
    return Boolean(addedAt && addedAt.getTime() < stopBefore.getTime());
  });
}

export async function fetchRecentGameMods(options: FetchRecentOptions): Promise<GameBananaModRecord[]> {
  const all: GameBananaModRecord[] = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const records = await fetchModPage(options.gameId, page, options.signal);
    all.push(...records);
    if (records.length < MODS_PER_PAGE || (options.stopBefore && containsRecordBefore(records, options.stopBefore))) break;
  }
  return all;
}

export function pageHasOlderRecords(records: GameBananaModRecord[], stopBefore: Date): boolean {
  return containsRecordBefore(records, stopBefore);
}
