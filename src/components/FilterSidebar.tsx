import { RotateCcw } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { Button, Dropdown, Input } from '../lib/webToolkit';
import { categoryLabel } from '../lib/filterSort';
import type { RangeMode } from '../types/game';
import type { FilterState, SortMode } from '../types/mod';

interface FilterSidebarProps {
  filters: FilterState;
  sortMode: SortMode;
  search: string;
  rangeMode: RangeMode;
  categories: string[];
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: FilterState) => void;
  onSortModeChange: (sortMode: SortMode) => void;
  onRangeModeChange: (rangeMode: RangeMode) => void;
  onApply: () => void;
  onReset: () => void;
}

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'downloads', label: 'Downloads' },
  { value: 'views', label: 'Views' },
  { value: 'likes', label: 'Likes' },
];

function toOptions(values: string[]): Array<{ value: string; label: string }> {
  return [{ value: 'all', label: 'All' }, ...values.map((value) => ({ value, label: categoryLabel(value) }))];
}

const rangeOptions: Array<{ value: RangeMode; label: string }> = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export function FilterSidebar({ filters, sortMode, search, rangeMode, categories, onSearchChange, onFiltersChange, onSortModeChange, onRangeModeChange, onApply, onReset }: FilterSidebarProps): JSX.Element {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => onFiltersChange({ ...filters, [key]: value });

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <h2>Filters</h2>
        <Button className="icon-button" onClick={onReset} title="Reset filters" aria-label="Reset filters">
          <RotateCcw size={15} aria-hidden="true" />
        </Button>
      </div>
      <div className="segmented" aria-label="Date range">
        {rangeOptions.map((option) => (
          <button key={option.value} type="button" className={rangeMode === option.value ? 'active' : ''} aria-pressed={rangeMode === option.value} onClick={() => onRangeModeChange(option.value)}>
            {option.label}
          </button>
        ))}
      </div>
      <label className="field">
        <span>Mod name</span>
        <Input value={search} onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)} placeholder="Search loaded mods" aria-label="Search loaded mods" />
      </label>
      <label className="field">
        <span>Sort</span>
        <Dropdown options={sortOptions} value={sortMode} onChange={(value: SortMode) => onSortModeChange(value)} />
      </label>
      <label className="field">
        <span>Category</span>
        <Dropdown options={toOptions(categories)} value={filters.category} onChange={(value: string) => update('category', value)} />
      </label>
      <div className="filter-actions">
        <Button onClick={onApply}>Apply</Button>
        <Button onClick={onReset}>Reset</Button>
      </div>
    </aside>
  );
}
