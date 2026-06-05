import type { GameBananaImage, GameBananaModRecord } from '../types/gamebanana';
import type { ModSummary } from '../types/mod';
import { timestampToDate } from '../lib/date';

function stripHtml(value: string | undefined): string {
  if (!value) return '';
  return value
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function imageUrl(image: GameBananaImage | undefined, size: '_sFile530' | '_sFile220' | '_sFile100' | '_sFile'): string | undefined {
  if (!image?._sBaseUrl) return undefined;
  const file = image[size] || image._sFile530 || image._sFile220 || image._sFile100 || image._sFile;
  return file ? `${image._sBaseUrl}/${file}` : undefined;
}

export function normalizeMod(record: GameBananaModRecord): ModSummary | null {
  const id = Number(record._idRow);
  const addedAt = timestampToDate(record._tsDateAdded);
  if (!Number.isFinite(id) || !addedAt) return null;

  const firstImage = record._aPreviewMedia?._aImages?.find((image) => Boolean(image._sBaseUrl && (image._sFile530 || image._sFile220 || image._sFile100 || image._sFile)));
  const files = Array.isArray(record._aFiles) ? record._aFiles : [];
  const description = stripHtml(record._sDescription) || stripHtml(files.find((file) => file._sDescription)?._sDescription);
  const version = files.find((file) => file._sVersion)?._sVersion;
  const category = record._aCategory?._sName || 'Uncategorized';
  const rootCategory = record._aRootCategory?._sName || 'Other';
  const categoryPath = rootCategory === category ? category : `${rootCategory} > ${category}`;

  return {
    id,
    name: record._sName?.trim() || `Mod ${id}`,
    url: record._sProfileUrl || `https://gamebanana.com/mods/${id}`,
    addedAt,
    addedTimestamp: addedAt.getTime(),
    submitterName: record._aSubmitter?._sName || 'Unknown submitter',
    submitterUrl: record._aSubmitter?._sProfileUrl,
    category,
    rootCategory,
    categoryPath,
    imageUrl: imageUrl(firstImage, '_sFile530'),
    thumbnailUrl: imageUrl(firstImage, '_sFile220'),
    description,
    downloads: Number(record._nDownloadCount) || 0,
    views: Number(record._nViewCount) || 0,
    likes: Number(record._nLikeCount) || 0,
    fileCount: files.length,
    version,
  };
}
