import { ExternalLink } from 'lucide-react';
import { Frame } from 'web-toolkit';
import type { ModSummary } from '../types/mod';
import { getLocalScore } from '../lib/filterSort';
import { StatPill } from './StatPill';

interface ModListRowProps {
  mod: ModSummary;
  compact: boolean;
}

export function ModListRow({ mod, compact }: ModListRowProps): JSX.Element {
  return (
    <Frame className={`mod-row ${compact ? 'compact' : ''}`}>
      <div className="mod-row__thumb">{mod.thumbnailUrl ? <img src={mod.thumbnailUrl} alt="" loading="lazy" /> : <span>FNF</span>}</div>
      <div className="mod-row__main">
        <div className="mod-card__meta">
          <span>{mod.category}</span>
          <span>{new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(mod.addedAt)}</span>
        </div>
        <h3>{mod.name}</h3>
        <p className="byline">by {mod.submitterName}</p>
        {!compact && <p className="mod-summary">{mod.description || mod.text || 'No description provided.'}</p>}
      </div>
      <div className="mod-row__stats">
        <StatPill type="downloads" value={mod.downloads} label="Downloads" />
        <StatPill type="views" value={mod.views} label="Views" />
        <StatPill type="likes" value={mod.likes} label="Likes" />
        <StatPill type="score" value={getLocalScore(mod)} label="Local score" />
      </div>
      <a className="icon-button link-button" href={mod.url} target="_blank" rel="noreferrer" title="Open on GameBanana">
        <ExternalLink size={16} aria-hidden="true" />
      </a>
    </Frame>
  );
}
