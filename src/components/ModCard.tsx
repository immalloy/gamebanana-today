import { ExternalLink } from 'lucide-react';
import { Frame } from 'web-toolkit';
import type { ModSummary } from '../types/mod';
import { StatPill } from './StatPill';

interface ModCardProps {
  mod: ModSummary;
  compact: boolean;
}

export function ModCard({ mod, compact }: ModCardProps): JSX.Element {
  return (
    <Frame className={`mod-card ${compact ? 'compact' : ''}`}>
      <a className="mod-card__media" href={mod.url} target="_blank" rel="noreferrer" aria-label={`Open ${mod.name}`}>
        {mod.imageUrl ? <img src={mod.imageUrl} alt="" loading="lazy" /> : <div className="mod-card__placeholder">FNF</div>}
      </a>
      <div className="mod-card__body">
        <div className="mod-card__meta">
          <span>{mod.rootCategory}</span>
          <span>{new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(mod.addedAt)}</span>
        </div>
        <h3>{mod.name}</h3>
        <p className="byline">by {mod.submitterName}</p>
        {!compact && mod.description && <p className="mod-summary">{mod.description}</p>}
        <div className="stat-row">
          <StatPill type="downloads" value={mod.downloads} label="Downloads" />
          <StatPill type="views" value={mod.views} label="Views" />
          <StatPill type="likes" value={mod.likes} label="Likes" />
        </div>
        <div className="card-actions">
          <span>{mod.category}</span>
          <a className="icon-button link-button" href={mod.url} target="_blank" rel="noreferrer" title="Open on GameBanana">
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </Frame>
  );
}
