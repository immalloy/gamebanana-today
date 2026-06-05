import type { ChangeEvent } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { Button, HeaderBar, Input } from 'web-toolkit';
import { formatDayRange } from '../lib/date';

interface AppHeaderProps {
  dayRange: { start: Date; end: Date };
  search: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
}

export function AppHeader({ dayRange, search, loading, onSearchChange, onRefresh }: AppHeaderProps): JSX.Element {
  return (
    <HeaderBar titlebar className="app-header">
      <HeaderBar.Title subtitle={formatDayRange(dayRange.start, dayRange.end)}>
        FNF Today
      </HeaderBar.Title>
      <Input.Group className="search-group">
        <span className="input-icon">
          <Search size={15} aria-hidden="true" />
        </span>
        <Input value={search} onChange={(event: ChangeEvent<HTMLInputElement>) => onSearchChange(event.target.value)} placeholder="Search loaded mods" aria-label="Search loaded mods" />
      </Input.Group>
      <HeaderBar.Controls>
        <Button className="icon-button" onClick={onRefresh} disabled={loading} title="Refresh">
          <RefreshCw size={16} aria-hidden="true" />
        </Button>
      </HeaderBar.Controls>
    </HeaderBar>
  );
}
