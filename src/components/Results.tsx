import { useEffect, useRef } from 'react';
import { Button, Frame, InfoBar, Spinner } from 'web-toolkit';
import type { ModSummary } from '../types/mod';
import { ModCard } from './ModCard';

interface ResultsProps {
  mods: ModSummary[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasLoadedMods: boolean;
  hasMore: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
}

export function Results({ mods, loading, loadingMore, error, hasLoadedMods, hasMore, onRetry, onLoadMore }: ResultsProps): JSX.Element {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || loadingMore || !hasMore || mods.length === 0) return undefined;
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, mods.length, onLoadMore]);

  const loader = (
    <div className="load-more-sentinel" ref={sentinelRef}>
      {loadingMore ? (
        <>
          <Spinner />
          <span>Loading more</span>
        </>
      ) : hasMore ? (
        <Button onClick={onLoadMore}>Load more</Button>
      ) : (
        <span>End of today</span>
      )}
    </div>
  );

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

  return (
    <>
      <div className="results-grid">
        {mods.map((mod) => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>
      {loader}
    </>
  );
}
