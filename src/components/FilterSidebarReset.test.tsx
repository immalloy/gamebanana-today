import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterSidebar } from './FilterSidebar';

describe('FilterSidebar reset button', () => {
  it('has an accessible name', () => {
    const onReset = vi.fn();

    render(
      <FilterSidebar
        filters={{ category: 'all' }}
        sortMode="newest"
        search=""
        rangeMode="daily"
        categories={[]}
        onSearchChange={() => undefined}
        onFiltersChange={() => undefined}
        onSortModeChange={() => undefined}
        onRangeModeChange={() => undefined}
        onApply={() => undefined}
        onReset={onReset}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
