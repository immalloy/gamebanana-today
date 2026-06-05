import { describe, expect, it } from 'vitest';
import { getLocalRange } from './date';

describe('getLocalRange', () => {
  it('returns the current local day', () => {
    const range = getLocalRange('daily', new Date(2026, 5, 5, 15, 30));

    expect(range.start).toEqual(new Date(2026, 5, 5, 0, 0, 0, 0));
    expect(range.end).toEqual(new Date(2026, 5, 6, 0, 0, 0, 0));
  });

  it('returns the current local week starting on Sunday', () => {
    const range = getLocalRange('weekly', new Date(2026, 5, 5, 15, 30));

    expect(range.start).toEqual(new Date(2026, 4, 31, 0, 0, 0, 0));
    expect(range.end).toEqual(new Date(2026, 5, 7, 0, 0, 0, 0));
  });

  it('returns the current local month', () => {
    const range = getLocalRange('monthly', new Date(2026, 5, 5, 15, 30));

    expect(range.start).toEqual(new Date(2026, 5, 1, 0, 0, 0, 0));
    expect(range.end).toEqual(new Date(2026, 6, 1, 0, 0, 0, 0));
  });
});
