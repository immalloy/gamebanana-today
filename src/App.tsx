import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Box, Button } from 'web-toolkit';
import { AppHeader } from './components/AppHeader';
import { FilterSidebar } from './components/FilterSidebar';
import { GameSelector } from './components/GameSelector';
import { Highlights } from './components/Highlights';
import { Results } from './components/Results';
import { Watermark } from './components/Watermark';
import { fetchGameProfilePage } from './api/gamebanana';
import { normalizeGame } from './api/normalizeGame';
import { useGameMods } from './hooks/useGameMods';
import { useGames } from './hooks/useGames';
import { formatRange, rangeLabel as getRangeLabel } from './lib/date';
import { applyFilters, getCategoryOptions, sortMods } from './lib/filterSort';
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
  gameImage: string | null;
}

function routeFromLocation(): RouteState {
  const source = window.location.search || (window.location.hash.startsWith('#?') ? window.location.hash.slice(1) : '');
  const params = new URLSearchParams(source);
  const gameId = Number(params.get('game'));
  const state = window.history.state as Partial<RouteState> | null;
  return {
    gameId: Number.isFinite(gameId) && gameId > 0 ? gameId : null,
    gameName: state?.gameName || null,
    gameImage: state?.gameImage || null,
  };
}

function gameUrl(game: GameSummary): string {
  const params = new URLSearchParams();
  params.set('game', String(game.id));
  return `${appBasePath}?${params.toString()}`;
}

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string | null): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!content) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function usePageMeta(title: string, description: string, image?: string): void {
  useEffect(() => {
    document.title = title;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image || null);
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image || null);
  }, [description, image, title]);
}

function GameSelectorView({ onSelectGame }: { onSelectGame: (game: GameSummary) => void }): JSX.Element {
  const [filters, setFilters] = useState(defaultGameFilters);
  const { games, loading, loadingMore, error, hasMore, refresh, loadMore } = useGames(filters);
  usePageMeta('Gamebanana Daily', 'Daily GameBanana mods by game.');

  return (
    <>
      <AppHeader title="Gamebanana Daily" />
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
      <Watermark />
    </>
  );
}

function GameModsView({ gameId, gameName, gameImage, onBack }: { gameId: number; gameName: string; gameImage?: string; onBack: () => void }): JSX.Element {
  const [rangeMode, setRangeMode] = useState<RangeMode>('daily');
  const { mods, loading, loadingMore, error, range, hasMore, refresh, loadMore } = useGameMods({ gameId, rangeMode });
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [noDuplicateHighlights, setNoDuplicateHighlights] = useState(false);
  const [profileGame, setProfileGame] = useState<GameSummary | null>(null);

  const categories = useMemo(() => getCategoryOptions(mods), [mods]);
  const visibleMods = useMemo(() => sortMods(applyFilters(mods, search, filters), sortMode), [filters, mods, search, sortMode]);
  const highlights = useMemo(() => selectHighlights(mods, noDuplicateHighlights), [mods, noDuplicateHighlights]);
  const readableRange = getRangeLabel(rangeMode);
  const formattedRange = formatRange(rangeMode, range.start, range.end);
  const displayGameName = profileGame?.name || gameName;
  const displayImage = profileGame?.imageUrl || gameImage;
  const pageTitle = `${displayGameName} ${readableRange}`;
  const pageDescription = `${readableRange} GameBanana mods for ${displayGameName}.`;
  usePageMeta(pageTitle, pageDescription, displayImage);

  useEffect(() => {
    const controller = new AbortController();
    setProfileGame(null);
    fetchGameProfilePage(gameId, controller.signal)
      .then((profile) => {
        const game = normalizeGame(profile);
        if (game) setProfileGame(game);
      })
      .catch(() => {
        if (!controller.signal.aborted) setProfileGame(null);
      });
    return () => controller.abort();
  }, [gameId]);

  const activeSummary = [
    search.trim() ? `search "${search.trim()}"` : '',
    filters.category !== 'all' ? filters.category : '',
    sortMode !== 'newest' ? sortMode : '',
  ].filter(Boolean);

  return (
    <>
      <AppHeader title={pageTitle} subtitle={pageDescription} />
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
            <h1>{pageTitle}</h1>
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
            gameName={displayGameName}
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
        <Watermark />
      </main>
      </div>
    </>
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
    const nextRoute = { gameId: game.id, gameName: game.name, gameImage: game.imageUrl || null };
    window.history.pushState(nextRoute, '', gameUrl(game));
    setRoute(nextRoute);
  };

  const backToGames = () => {
    window.history.pushState({ gameId: null, gameName: null, gameImage: null }, '', appBasePath);
    setRoute({ gameId: null, gameName: null, gameImage: null });
  };

  return (
    <Box vertical className="app background">
      {route.gameId ? (
        <GameModsView gameId={route.gameId} gameName={route.gameName || `Game ${route.gameId}`} gameImage={route.gameImage || undefined} onBack={backToGames} />
      ) : (
        <GameSelectorView onSelectGame={selectGame} />
      )}
    </Box>
  );
}

export default App;
