import type { ChangeEvent } from 'react';
import { Grid2X2, List, Moon, RefreshCw, Search, Sun } from 'lucide-react';
import { Button, HeaderBar, Input, Switch } from 'web-toolkit';
import type { ViewMode } from '../types/mod';
import { formatDayRange } from '../lib/date';

interface AppHeaderProps {
  dayRange: { start: Date; end: Date };
  search: string;
  viewMode: ViewMode;
  dark: boolean;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onViewModeChange: (value: ViewMode) => void;
  onDarkChange: (value: boolean) => void;
  onRefresh: () => void;
}

export function AppHeader({ dayRange, search, viewMode, dark, loading, onSearchChange, onViewModeChange, onDarkChange, onRefresh }: AppHeaderProps): JSX.Element {
  return (
    <HeaderBar titlebar className="app-header">
      <HeaderBar.Title subtitle={formatDayRange(dayRange.start, dayRange.end)} fill>
        FNF Today
      </HeaderBar.Title>
      <Input.Group className="search-group">
        <span className="input-icon">
          <Search size={15} aria-hidden="true" />
        </span>
        <Input value={search} onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)} placeholder="Search loaded mods" aria-label="Search loaded mods" />
      </Input.Group>
      <div className="segmented" aria-label="View mode">
        <Button className={viewMode === 'grid' ? 'active' : ''} onClick={() => onViewModeChange('grid')} title="Grid view">
          <Grid2X2 size={16} aria-hidden="true" />
        </Button>
        <Button className={viewMode === 'list' ? 'active' : ''} onClick={() => onViewModeChange('list')} title="List view">
          <List size={16} aria-hidden="true" />
        </Button>
      </div>
      <label className="theme-toggle" title="Toggle theme">
        {dark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
        <Switch value={dark} onChange={(value: boolean) => onDarkChange(value)} label="Dark theme" />
      </label>
      <HeaderBar.Controls>
        <Button className="icon-button" onClick={onRefresh} disabled={loading} title="Refresh">
          <RefreshCw size={16} aria-hidden="true" />
        </Button>
      </HeaderBar.Controls>
    </HeaderBar>
  );
}
