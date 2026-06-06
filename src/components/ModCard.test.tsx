import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ModCard } from './ModCard';
import type { ModSummary } from '../types/mod';

function mod(overrides: Partial<ModSummary> = {}): ModSummary {
  const addedAt = new Date('2026-06-06T15:30:00.000Z');
  return {
    id: 1,
    name: 'Fresh Mod',
    url: 'https://gamebanana.com/mods/1',
    addedAt,
    addedTimestamp: addedAt.getTime(),
    submitterName: 'Submitter',
    category: 'Skins',
    rootCategory: 'Skins',
    categoryPath: 'Skins',
    description: '',
    downloads: 1234,
    views: 5678,
    likes: 90,
    fileCount: 1,
    ...overrides,
  };
}

describe('ModCard', () => {
  it('renders a semantic timestamp and accessible stats', () => {
    const current = mod();
    const { container } = render(<ModCard mod={current} />);

    expect(screen.getByRole('link', { name: 'Open Fresh Mod' }).getAttribute('href')).toBe(current.url);
    expect(container.querySelector('time')?.getAttribute('datetime')).toBe(current.addedAt.toISOString());
    expect(screen.getByLabelText('1,234 downloads')).not.toBeNull();
    expect(screen.getByLabelText('5,678 views')).not.toBeNull();
    expect(screen.getByLabelText('90 likes')).not.toBeNull();
  });
});
