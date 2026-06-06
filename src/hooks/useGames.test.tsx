import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useGames } from './useGames';
import { fetchGamePage } from '../api/gamebanana';
import type { GameFilterState } from '../types/game';

vi.mock('../api/gamebanana', () => ({
  GAMES_PER_PAGE: 36,
  fetchGamePage: vi.fn(),
  fetchGameProfilePage: vi.fn(),
}));

function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const defaultFilters: GameFilterState = {
  name: '',
  nameOperator: 'contains',
  sort: 'Game_MostSubmissions',
};

function GamesProbe({ filters }: { filters: GameFilterState }): JSX.Element {
  const state = useGames(filters);
  return <div data-loading={state.loading} data-count={state.games.length} />;
}

describe('useGames', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts a replacement request when filters change during an in-flight load', async () => {
    const first = deferred<[]>();
    vi.mocked(fetchGamePage)
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce([]);

    const { rerender } = render(<GamesProbe filters={defaultFilters} />);

    await waitFor(() => expect(fetchGamePage).toHaveBeenCalledTimes(1));
    rerender(<GamesProbe filters={{ ...defaultFilters, name: 'funkin' }} />);

    await waitFor(() => expect(fetchGamePage).toHaveBeenCalledTimes(2));
    first.resolve([]);
  });
});
