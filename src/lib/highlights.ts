import type { ModSummary } from '../types/mod';

export interface Highlight {
  id: string;
  label: string;
  mod: ModSummary;
}

interface HighlightRule {
  id: string;
  label: string;
  sort: (a: ModSummary, b: ModSummary) => number;
  hasValue: (mod: ModSummary) => boolean;
}

const newestTieBreak = (a: ModSummary, b: ModSummary): number => b.addedTimestamp - a.addedTimestamp || a.name.localeCompare(b.name);

const rules: HighlightRule[] = [
  {
    id: 'downloads',
    label: 'Most downloaded',
    sort: (a, b) => b.downloads - a.downloads || newestTieBreak(a, b),
    hasValue: (mod) => mod.downloads > 0,
  },
  {
    id: 'likes',
    label: 'Most liked',
    sort: (a, b) => b.likes - a.likes || newestTieBreak(a, b),
    hasValue: (mod) => mod.likes > 0,
  },
  {
    id: 'views',
    label: 'Most viewed',
    sort: (a, b) => b.views - a.views || newestTieBreak(a, b),
    hasValue: (mod) => mod.views > 0,
  },
];

export function selectHighlights(mods: ModSummary[], noDuplicates = false): Highlight[] {
  if (mods.length === 0) return [];

  const used = new Set<number>();
  const choose = (rule: HighlightRule): Highlight | null => {
    const sorted = mods.filter(rule.hasValue).sort(rule.sort);
    const mod = sorted.find((candidate) => !noDuplicates || !used.has(candidate.id));
    if (!mod) return null;
    used.add(mod.id);
    return { id: rule.id, label: rule.label, mod };
  };

  return rules.map(choose).filter((highlight): highlight is Highlight => Boolean(highlight));
}
