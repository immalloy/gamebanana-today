import { RotateCcw } from 'lucide-react';
import { Button, Dropdown } from 'web-toolkit';
import type { FilterState, SortMode } from '../types/mod';

interface FilterSidebarProps {
  filters: FilterState;
  sortMode: SortMode;
  categories: string[];
  onFiltersChange: (filters: FilterState) => void;
  onSortModeChange: (sortMode: SortMode) => void;
  onReset: () => void;
}

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'downloads', label: 'Downloads' },
  { value: 'views', label: 'Views' },
  { value: 'likes', label: 'Likes' },
];

function toOptions(values: string[]): Array<{ value: string; label: string }> {
  return [{ value: 'all', label: 'All' }, ...values.map((value) => ({ value, label: value }))];
}

export function FilterSidebar({ filters, sortMode, categories, onFiltersChange, onSortModeChange, onReset }: FilterSidebarProps): JSX.Element {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => onFiltersChange({ ...filters, [key]: value });

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <h2>Filters</h2>
        <Button className="icon-button" onClick={onReset} title="Reset filters">
          <RotateCcw size={15} aria-hidden="true" />
        </Button>
      </div>
      <label className="field">
        <span>Sort</span>
        <Dropdown options={sortOptions} value={sortMode} onChange={(value: SortMode) => onSortModeChange(value)} />
      </label>
      <label className="field">
        <span>Category</span>
        <Dropdown options={toOptions(categories)} value={filters.category} onChange={(value: string) => update('category', value)} />
      </label>
    </aside>
  );
}
