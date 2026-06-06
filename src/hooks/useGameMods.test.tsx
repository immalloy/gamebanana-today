import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchModPage } from '../api/gamebanana';
import type { RangeMode } from '../types/game';
import { useGameMods } from './useGameMods';

vi.mock('../api/gamebanana', () => ({
  MODS_PER_PAGE: 50,
  fetchModPage: vi.fn(),
  pageHasOlderRecords: vi.fn(() => false),
}));

function deferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function ModsProbe({ rangeMode }: { rangeMode: RangeMode }): JSX.Element {
  const state = useGameMods({ gameId: 8694, rangeMode });
  return <div data-loading={state.loading} data-count={state.mods.length} />;
}

describe('useGameMods', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts a replacement request when range changes during an in-flight load', async () => {
    const first = deferred<[]>();
    vi.mocked(fetchModPage)
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce([]);

    const { rerender } = render(<ModsProbe rangeMode="daily" />);

    await waitFor(() => expect(fetchModPage).toHaveBeenCalledTimes(1));
    rerender(<ModsProbe rangeMode="weekly" />);

    await waitFor(() => expect(fetchModPage).toHaveBeenCalledTimes(2));
    first.resolve([]);
  });
});
