import { Frame } from '../lib/webToolkit';
import type { ModSummary } from '../types/mod';
import { StatPill } from './StatPill';

interface ModCardProps {
  mod: ModSummary;
}

export function ModCard({ mod }: ModCardProps): JSX.Element {
  return (
    <Frame className="mod-card">
      <a className="mod-card__media" href={mod.url} target="_blank" rel="noreferrer" aria-label={`Open ${mod.name}`}>
        {mod.imageUrl ? <img src={mod.imageUrl} alt="" loading="lazy" /> : <div className="mod-card__placeholder">MOD</div>}
      </a>
      <div className="mod-card__body">
        <h3>{mod.name}</h3>
        <p className="byline">by {mod.submitterName}</p>
        <p className="card-meta-line">
          <span>{mod.category}</span>
          <span>{new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(mod.addedAt)}</span>
        </p>
        <div className="stat-row">
          <StatPill type="downloads" value={mod.downloads} label="Downloads" />
          <StatPill type="views" value={mod.views} label="Views" />
          <StatPill type="likes" value={mod.likes} label="Likes" />
        </div>
      </div>
    </Frame>
  );
}
