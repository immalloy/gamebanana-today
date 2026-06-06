import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { GameSelector } from './GameSelector';
import type { GameFilterState } from '../types/game';

const filters: GameFilterState = {
  name: 'funkin',
  nameOperator: 'contains',
  sort: 'Game_MostSubmissions',
};

describe('GameSelector', () => {
  it('exposes the icon reset button with an accessible name', () => {
    const onFiltersApply = vi.fn();

    render(
      <GameSelector
        games={[]}
        filters={filters}
        loading={false}
        loadingMore={false}
        error={null}
        hasMore={false}
        onFiltersApply={onFiltersApply}
        onLoadMore={() => undefined}
        onRetry={() => undefined}
        onSelectGame={() => undefined}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reset game filters' }));

    expect(onFiltersApply).toHaveBeenCalledWith({
      name: '',
      nameOperator: 'contains',
      sort: 'Game_MostSubmissions',
    });
  });
});
