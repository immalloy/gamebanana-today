import type { GameBananaGameRecord, GameBananaImage } from '../types/gamebanana';
import type { GameSummary } from '../types/game';

function imageUrl(image: GameBananaImage | undefined): string | undefined {
  if (image?._sUrl) return image._sUrl;
  if (!image?._sBaseUrl) return undefined;
  const file = image._sFile530 || image._sFile220 || image._sFile100 || image._sFile;
  return file ? `${image._sBaseUrl}/${file}` : undefined;
}

function firstNumber(...values: Array<number | string | undefined>): number | undefined {
  for (const value of values) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) return numeric;
  }
  return undefined;
}

export function normalizeGame(record: GameBananaGameRecord): GameSummary | null {
  const id = Number(record._idRow);
  if (!Number.isFinite(id)) return null;

  const preview = record._aPreviewMedia?._aImages?.find((image) => Boolean(image._sUrl || (image._sBaseUrl && (image._sFile530 || image._sFile220 || image._sFile100 || image._sFile))));
  const banner = record._aPreviewMedia?._aImages?.find((image) => image._sType === 'banner' && (image._sUrl || image._sBaseUrl));
  const image = record._sBannerUrl || record._sImageUrl || imageUrl(preview) || record._sIconUrl;

  return {
    id,
    name: record._sName?.trim() || `Game ${id}`,
    url: record._sProfileUrl || `https://gamebanana.com/games/${id}`,
    imageUrl: imageUrl(banner) || image,
    submissionCount: firstNumber(record._nSubmitCount, record._nSubmissionCount, record._nModCount),
  };
}
