import { Button, Frame, InfoBar, Spinner } from 'web-toolkit';
import type { ModSummary, ViewMode } from '../types/mod';
import { ModCard } from './ModCard';
import { ModListRow } from './ModListRow';

interface ResultsProps {
  mods: ModSummary[];
  loading: boolean;
  error: string | null;
  hasLoadedMods: boolean;
  viewMode: ViewMode;
  compact: boolean;
  onRetry: () => void;
}

export function Results({ mods, loading, error, hasLoadedMods, viewMode, compact, onRetry }: ResultsProps): JSX.Element {
  if (loading) {
    return (
      <Frame className="state-panel">
        <Spinner />
        <h2>Loading today's FNF mods</h2>
        <p>Fetching current GameBanana pages for Friday Night Funkin'.</p>
      </Frame>
    );
  }

  if (error) {
    return (
      <InfoBar className="state-panel error-state">
        <h2>GameBanana could not be loaded</h2>
        <p>{error}</p>
        <Button onClick={onRetry}>Retry</Button>
      </InfoBar>
    );
  }

  if (!hasLoadedMods) {
    return (
      <Frame className="state-panel">
        <h2>No FNF mods found for today</h2>
        <p>GameBanana did not return releases inside your current local calendar day.</p>
        <Button onClick={onRetry}>Refresh</Button>
      </Frame>
    );
  }

  if (mods.length === 0) {
    return (
      <Frame className="state-panel">
        <h2>No results match these filters</h2>
        <p>Change the search text or filter settings to widen the result set.</p>
      </Frame>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="results-list">
        {mods.map((mod) => (
          <ModListRow key={mod.id} mod={mod} compact={compact} />
        ))}
      </div>
    );
  }

  return (
    <div className="results-grid">
      {mods.map((mod) => (
        <ModCard key={mod.id} mod={mod} compact={compact} />
      ))}
    </div>
  );
}
