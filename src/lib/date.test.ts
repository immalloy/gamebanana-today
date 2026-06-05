import { describe, expect, it } from 'vitest';
import { getLocalDayRange, isWithinRange, timestampToDate } from './date';

describe('date helpers', () => {
  it('treats GameBanana timestamps as Unix seconds unless already milliseconds', () => {
    expect(timestampToDate(1780626559)?.getTime()).toBe(1780626559000);
    expect(timestampToDate(1780626559000)?.getTime()).toBe(1780626559000);
  });

  it('uses a half-open local day range', () => {
    const range = getLocalDayRange(new Date(2026, 5, 5, 12));

    expect(isWithinRange(new Date(2026, 5, 5, 0), range.start, range.end)).toBe(true);
    expect(isWithinRange(new Date(2026, 5, 6, 0), range.start, range.end)).toBe(false);
  });
});
