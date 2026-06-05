import { useMemo, useState } from 'react';
import { Box, Paned } from 'web-toolkit';
import { AppHeader } from './components/AppHeader';
import { FilterSidebar } from './components/FilterSidebar';
import { Highlights } from './components/Highlights';
import { Results } from './components/Results';
import { useTodayMods } from './hooks/useTodayMods';
import { applyFilters, getOptionValues, sortMods } from './lib/filterSort';
import { selectHighlights } from './lib/highlights';
import type { FilterState, SortMode, ViewMode } from './types/mod';

const defaultFilters: FilterState = {
  category: 'all',
  rootCategory: 'all',
  onlyWithImages: false,
  onlyWithDescription: false,
  compact: false,
};

function App(): JSX.Element {
  const { mods, allLoadedCount, loading, error, refreshedAt, dayRange, refresh } = useTodayMods();
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [dark, setDark] = useState(false);

  const categories = useMemo(() => getOptionValues(mods, 'category'), [mods]);
  const rootCategories = useMemo(() => getOptionValues(mods, 'rootCategory'), [mods]);
  const visibleMods = useMemo(() => sortMods(applyFilters(mods, search, filters), sortMode), [filters, mods, search, sortMode]);
  const highlights = useMemo(() => selectHighlights(mods), [mods]);

  const activeSummary = [
    search.trim() ? `search "${search.trim()}"` : '',
    filters.rootCategory !== 'all' ? filters.rootCategory : '',
    filters.category !== 'all' ? filters.category : '',
    filters.onlyWithImages ? 'preview media' : '',
    filters.onlyWithDescription ? 'description' : '',
  ].filter(Boolean);

  return (
    <Box vertical className={`app background ${dark ? 'theme-dark' : ''}`}>
      <AppHeader
        dayRange={dayRange}
        search={search}
        viewMode={viewMode}
        dark={dark}
        loading={loading}
        onSearchChange={setSearch}
        onViewModeChange={setViewMode}
        onDarkChange={setDark}
        onRefresh={refresh}
      />
      <Paned defaultSize={282} fill border="handle" className="app-paned">
        <FilterSidebar
          filters={filters}
          sortMode={sortMode}
          categories={categories}
          rootCategories={rootCategories}
          onFiltersChange={setFilters}
          onSortModeChange={setSortMode}
          onReset={() => {
            setSearch('');
            setSortMode('newest');
            setFilters(defaultFilters);
          }}
        />
        <main className="content">
          <Highlights highlights={highlights} />
          <section className="section">
            <div className="section-heading">
              <div>
                <h2>Results</h2>
                <p>
                  {visibleMods.length.toLocaleString()} of {mods.length.toLocaleString()} today
                  {allLoadedCount ? `, from ${allLoadedCount.toLocaleString()} loaded mods` : ''}
                </p>
              </div>
              <span>{activeSummary.length ? activeSummary.join(' / ') : refreshedAt ? `Updated ${new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(refreshedAt)}` : 'Ready'}</span>
            </div>
            <Results mods={visibleMods} loading={loading} error={error} hasLoadedMods={mods.length > 0} viewMode={viewMode} compact={filters.compact} onRetry={refresh} />
          </section>
        </main>
      </Paned>
    </Box>
  );
}

export default App;
