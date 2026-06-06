import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Highlights } from './Highlights';
import type { Highlight } from '../lib/highlights';
import type { ModSummary } from '../types/mod';

function mod(overrides: Partial<ModSummary> = {}): ModSummary {
  return {
    id: 1,
    name: 'Fresh Mod',
    url: 'https://gamebanana.com/mods/1',
    addedAt: new Date(0),
    addedTimestamp: 0,
    submitterName: 'Submitter',
    category: 'General',
    rootCategory: 'Other',
    categoryPath: 'Other > General',
    description: '',
    downloads: 10,
    views: 20,
    likes: 5,
    fileCount: 0,
    ...overrides,
  };
}

describe('Highlights', () => {
  const highlights: Highlight[] = [
    { id: 'downloads', label: 'Most downloaded', mod: mod() },
  ];

  it('renders nothing when there are no highlights', () => {
    const { container } = render(<Highlights highlights={[]} rangeLabel="Daily" noDuplicates={false} onNoDuplicatesChange={() => undefined} />);

    expect(container.firstChild).toBeNull();
  });

  it('uses a single label for the duplicate toggle', () => {
    const onNoDuplicatesChange = vi.fn();
    const { container } = render(<Highlights highlights={highlights} rangeLabel="Daily" noDuplicates={false} onNoDuplicatesChange={onNoDuplicatesChange} />);

    expect(container.querySelectorAll('label label')).toHaveLength(0);
    fireEvent.click(screen.getByLabelText('No duplicate highlights'));
    expect(onNoDuplicatesChange).toHaveBeenCalledWith(true);
  });
});
