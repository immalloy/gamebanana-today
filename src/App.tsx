import { useMemo, useState } from 'react';
import { Box } from 'web-toolkit';
import { AppHeader } from './components/AppHeader';
import { FilterSidebar } from './components/FilterSidebar';
import { Highlights } from './components/Highlights';
import { Results } from './components/Results';
import { useTodayMods } from './hooks/useTodayMods';
import { applyFilters, getOptionValues, sortMods } from './lib/filterSort';
import { selectHighlights } from './lib/highlights';
import type { FilterState, SortMode } from './types/mod';

const defaultFilters: FilterState = {
  category: 'all',
};

function App(): JSX.Element {
  const { mods, loading, loadingMore, error, dayRange, hasMore, refresh, loadMore } = useTodayMods();
  const [search, setSearch] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [noDuplicateHighlights, setNoDuplicateHighlights] = useState(false);

  const categories = useMemo(() => getOptionValues(mods, 'category'), [mods]);
  const visibleMods = useMemo(() => sortMods(applyFilters(mods, search, filters), sortMode), [filters, mods, search, sortMode]);
  const highlights = useMemo(() => selectHighlights(mods, noDuplicateHighlights), [mods, noDuplicateHighlights]);

  const activeSummary = [
    search.trim() ? `search "${search.trim()}"` : '',
    filters.category !== 'all' ? filters.category : '',
  ].filter(Boolean);

  return (
    <Box vertical className="app background">
      <AppHeader
        dayRange={dayRange}
        search={search}
        loading={loading}
        onSearchChange={setSearch}
        onRefresh={refresh}
      />
      <div className="app-shell">
        <FilterSidebar
          filters={filters}
          sortMode={sortMode}
          categories={categories}
          onFiltersChange={setFilters}
          onSortModeChange={setSortMode}
          onReset={() => {
            setSearch('');
            setSortMode('newest');
            setFilters(defaultFilters);
          }}
        />
        <main className="content">
          <Highlights highlights={highlights} noDuplicates={noDuplicateHighlights} onNoDuplicatesChange={setNoDuplicateHighlights} />
          <section className="section">
            <div className="section-heading">
              <div>
                <h2>Results</h2>
              </div>
              {activeSummary.length > 0 && <span>{activeSummary.join(' / ')}</span>}
            </div>
            <Results
              mods={visibleMods}
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
    </Box>
  );
}

export default App;
