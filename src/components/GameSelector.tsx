import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, Dropdown, Frame, InfoBar, Input, Spinner } from 'web-toolkit';
import type { GameFilterState, GameNameOperator, GameSortMode, GameSummary } from '../types/game';

interface GameSelectorProps {
  games: GameSummary[];
  filters: GameFilterState;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  onFiltersApply: (filters: GameFilterState) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onSelectGame: (game: GameSummary) => void;
}

const operatorOptions: Array<{ value: GameNameOperator; label: string }> = [
  { value: 'contains', label: 'Contains' },
  { value: 'starts', label: 'Starts with' },
  { value: 'equals', label: 'Exact' },
];

const sortOptions: Array<{ value: GameSortMode; label: string }> = [
  { value: 'Game_MostSubmissions', label: 'Most Submissions' },
  { value: 'Game_Name', label: 'Name' },
  { value: 'Game_Latest', label: 'Latest' },
];

const defaultFilters: GameFilterState = {
  name: '',
  nameOperator: 'contains',
  sort: 'Game_MostSubmissions',
};

export function GameSelector({ games, filters, loading, loadingMore, error, hasMore, onFiltersApply, onLoadMore, onRetry, onSelectGame }: GameSelectorProps): JSX.Element {
  const [draft, setDraft] = useState(filters);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setDraft(filters), [filters]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading || loadingMore || !hasMore || games.length === 0) return undefined;
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin: '700px 0px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [games.length, hasMore, loading, loadingMore, onLoadMore]);

  const apply = () => onFiltersApply(draft);
  const reset = () => {
    setDraft(defaultFilters);
    onFiltersApply(defaultFilters);
  };

  return (
    <main className="selector-page">
      <section className="selector-toolbar">
        <div>
          <h1>Gamebanana Daily</h1>
        </div>
        <div className="selector-filters">
          <label className="field">
            <span>Name</span>
            <Input value={draft.name} onChange={(event: ChangeEvent<HTMLInputElement>) => setDraft({ ...draft, name: event.target.value })} placeholder="Search games" aria-label="Search games" />
          </label>
          <label className="field">
            <span>Operator</span>
            <Dropdown options={operatorOptions} value={draft.nameOperator} onChange={(value: GameNameOperator) => setDraft({ ...draft, nameOperator: value })} />
          </label>
          <label className="field">
            <span>Order</span>
            <Dropdown options={sortOptions} value={draft.sort} onChange={(value: GameSortMode) => setDraft({ ...draft, sort: value })} />
          </label>
          <div className="selector-actions">
            <Button onClick={apply}>Apply</Button>
            <Button className="icon-button" onClick={reset} title="Reset game filters">
              <RotateCcw size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>

      {loading ? (
        <Frame className="state-panel">
          <Spinner />
          <h2>Loading GameBanana games</h2>
          <p>Fetching games sorted by most submissions.</p>
        </Frame>
      ) : error ? (
        <InfoBar className="state-panel error-state">
          <h2>GameBanana games could not be loaded</h2>
          <p>{error}</p>
          <Button onClick={onRetry}>Retry</Button>
        </InfoBar>
      ) : games.length === 0 ? (
        <Frame className="state-panel">
          <h2>No games found</h2>
          <p>Adjust the name filter or reset the selector.</p>
          <Button onClick={reset}>Reset</Button>
        </Frame>
      ) : (
        <>
          <div className="game-grid">
            {games.map((game) => (
              <Frame className="game-card" key={game.id}>
                <button type="button" onClick={() => onSelectGame(game)}>
                  <span className="game-card__media">
                    {game.imageUrl ? <img src={game.imageUrl} alt="" loading="lazy" /> : <span className="game-card__placeholder">GB</span>}
                  </span>
                  <span className="game-card__body">
                    <strong>{game.name}</strong>
                    <span>{game.submissionCount === undefined ? 'Open mods' : `${game.submissionCount.toLocaleString()} mods`}</span>
                  </span>
                </button>
              </Frame>
            ))}
          </div>
          <div className="load-more-sentinel" ref={sentinelRef}>
            {loadingMore ? (
              <>
                <Spinner />
                <span>Loading more games</span>
              </>
            ) : hasMore ? (
              <Button onClick={onLoadMore}>Load more</Button>
            ) : (
              <span>End of games</span>
            )}
          </div>
        </>
      )}
    </main>
  );
}
