import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FilterSidebar } from './FilterSidebar';

describe('FilterSidebar range buttons', () => {
  it('exposes selected range state', () => {
    const onRangeModeChange = vi.fn();

    render(
      <FilterSidebar
        filters={{ category: 'all' }}
        sortMode="newest"
        search=""
        rangeMode="weekly"
        categories={['Skins']}
        onSearchChange={() => undefined}
        onFiltersChange={() => undefined}
        onSortModeChange={() => undefined}
        onRangeModeChange={onRangeModeChange}
        onApply={() => undefined}
        onReset={() => undefined}
      />,
    );

    expect(screen.getByRole('button', { name: 'Weekly' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Daily' }).getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(screen.getByRole('button', { name: 'Monthly' }));
    expect(onRangeModeChange).toHaveBeenCalledWith('monthly');
  });
});
