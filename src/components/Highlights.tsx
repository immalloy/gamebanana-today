import { Frame, Switch } from '../lib/webToolkit';
import type { Highlight } from '../lib/highlights';
import { StatPill } from './StatPill';

interface HighlightsProps {
  highlights: Highlight[];
  rangeLabel: string;
  noDuplicates: boolean;
  onNoDuplicatesChange: (value: boolean) => void;
}

export function Highlights({ highlights, rangeLabel, noDuplicates, onNoDuplicatesChange }: HighlightsProps): JSX.Element | null {
  if (highlights.length === 0) return null;

  return (
    <section className="section">
      <div className="section-heading">
        <h2>{rangeLabel} Highlights</h2>
        <label className="highlight-toggle">
          <span>No duplicates</span>
          <Switch value={noDuplicates} onChange={(value: boolean) => onNoDuplicatesChange(value)} label="No duplicate highlights" />
        </label>
      </div>
      <div className="highlight-grid">
        {highlights.map((highlight) => (
          <Frame className="highlight-card" key={highlight.id}>
            <a href={highlight.mod.url} target="_blank" rel="noreferrer">
              {highlight.mod.imageUrl ? <img src={highlight.mod.imageUrl} alt="" loading="lazy" /> : <div className="highlight-placeholder">MOD</div>}
              <div>
                <span>{highlight.label}</span>
                <strong>{highlight.mod.name}</strong>
                <em>by {highlight.mod.submitterName}</em>
                <div className="highlight-stats">
                  <StatPill type="downloads" value={highlight.mod.downloads} label="Downloads" />
                  <StatPill type="views" value={highlight.mod.views} label="Views" />
                  <StatPill type="likes" value={highlight.mod.likes} label="Likes" />
                </div>
              </div>
            </a>
          </Frame>
        ))}
      </div>
    </section>
  );
}
