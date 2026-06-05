import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Box, Button } from 'web-toolkit';
import { AppHeader } from './components/AppHeader';
import { FilterSidebar } from './components/FilterSidebar';
import { GameSelector } from './components/GameSelector';
import { Highlights } from './components/Highlights';
import { Results } from './components/Results';
import { useGameMods } from './hooks/useGameMods';
import { useGames } from './hooks/useGames';
import { formatRange, rangeLabel as getRangeLabel } from './lib/date';
import { applyFilters, getOptionValues, sortMods } from './lib/filterSort';
import { selectHighlights } from './lib/highlights';
import type { GameFilterState, GameSummary, RangeMode } from './types/game';
import type { FilterState, SortMode } from './types/mod';

const defaultFilters: FilterState = {
  category: 'all',
};

const defaultGameFilters: GameFilterState = {
  name: '',
  nameOperator: 'contains',
  sort: 'Game_MostSubmissions',
};
const appBasePath = import.meta.env.BASE_URL || '/';

interface RouteState {
  gameId: number | null;
  gameName: string | null;
}

function routeFromLocation(): RouteState {
  const source = window.location.search || (window.location.hash.startsWith('#?') ? window.location.hash.slice(1) : '');
  const params = new URLSearchParams(source);
  const gameId = Number(params.get('game'));
  return {
    gameId: Number.isFinite(gameId) && gameId > 0 ? gameId : null,
    gameName: params.get('name'),
  };
}

function gameUrl(game: GameSummary): string {
  const params = new URLSearchParams();
  params.set('game', String(game.id));
  params.set('name', game.name);
  return `${appBasePath}?${params.toString()}`;
}

function GameSelectorView({ onSelectGame }: { onSelectGame: (game: GameSummary) => void }): JSX.Element {
  const [filters, setFilters] = useState(defaultGameFilters);
  const { games, loading, loadingMore, error, hasMore, refresh, loadMore } = useGames(filters);

  return (
    <GameSelector
      games={games}
      filters={filters}
      loading={loading}
      loadingMore={loadingMore}
      error={error}
      hasMore={hasMore}
      onFiltersApply={setFilters}
      onLoadMore={loadMore}
      onRetry={refresh}
      onSelectGame={onSelectGame}
    />
  );
}

function GameModsView({ gameId, gameName, onBack }: { gameId: number; gameName: string; onBack: () => void }): JSX.Element {
  const [rangeMode, setRangeMode] = useState<RangeMode>('daily');
  const { mods, loading, loadingMore, error, range, hasMore, refresh, loadMore } = useGameMods({ gameId, rangeMode });
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [noDuplicateHighlights, setNoDuplicateHighlights] = useState(false);

  const categories = useMemo(() => getOptionValues(mods, 'category'), [mods]);
  const visibleMods = useMemo(() => sortMods(applyFilters(mods, search, filters), sortMode), [filters, mods, search, sortMode]);
  const highlights = useMemo(() => selectHighlights(mods, noDuplicateHighlights), [mods, noDuplicateHighlights]);
  const readableRange = getRangeLabel(rangeMode);
  const formattedRange = formatRange(rangeMode, range.start, range.end);

  const activeSummary = [
    search.trim() ? `search "${search.trim()}"` : '',
    filters.category !== 'all' ? filters.category : '',
    sortMode !== 'newest' ? sortMode : '',
  ].filter(Boolean);

  return (
    <div className="app-shell">
      <FilterSidebar
        filters={filters}
        sortMode={sortMode}
        search={search}
        rangeMode={rangeMode}
        categories={categories}
        onSearchChange={setSearch}
        onFiltersChange={setFilters}
        onSortModeChange={setSortMode}
        onRangeModeChange={setRangeMode}
        onApply={refresh}
        onReset={() => {
          setSearch('');
          setSortMode('newest');
          setFilters(defaultFilters);
          setRangeMode('daily');
        }}
      />
      <main className="content">
        <section className="section game-title-section">
          <Button className="back-button" onClick={onBack}>
            <ArrowLeft size={16} aria-hidden="true" />
            Games
          </Button>
          <div>
            <h1>{gameName}</h1>
            <p>{readableRange} Mods / {formattedRange}</p>
          </div>
        </section>
        <Highlights highlights={highlights} rangeLabel={readableRange} noDuplicates={noDuplicateHighlights} onNoDuplicatesChange={setNoDuplicateHighlights} />
        <section className="section">
          <div className="section-heading">
            <div>
              <h2>Results</h2>
              <p>{visibleMods.length.toLocaleString()} visible / {mods.length.toLocaleString()} loaded</p>
            </div>
            {activeSummary.length > 0 && <span>{activeSummary.join(' / ')}</span>}
          </div>
          <Results
            mods={visibleMods}
            gameName={gameName}
            rangeLabel={readableRange}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasLoadedMods={mods.length > 0}
            hasMore={hasMore}
            onRetry={refresh}
            onLoadMore={loadMore}
          />
        </section>
      </main>
    </div>
  );
}

function App(): JSX.Element {
  const [route, setRoute] = useState<RouteState>(() => routeFromLocation());

  useEffect(() => {
    const onPopState = () => setRoute(routeFromLocation());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const selectGame = (game: GameSummary) => {
    window.history.pushState(null, '', gameUrl(game));
    setRoute({ gameId: game.id, gameName: game.name });
  };

  const backToGames = () => {
    window.history.pushState(null, '', appBasePath);
    setRoute({ gameId: null, gameName: null });
  };

  return (
    <Box vertical className="app background">
      <AppHeader />
      {route.gameId ? (
        <GameModsView gameId={route.gameId} gameName={route.gameName || `Game ${route.gameId}`} onBack={backToGames} />
      ) : (
        <GameSelectorView onSelectGame={selectGame} />
      )}
    </Box>
  );
}

export default App;
