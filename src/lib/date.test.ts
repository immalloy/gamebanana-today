import { describe, expect, it } from 'vitest';
import { formatRange, getLocalDayRange, getLocalRange, isWithinRange, rangeLabel, timestampToDate } from './date';

describe('date helpers', () => {
  it('builds local daily ranges from midnight to next midnight', () => {
    const { start, end } = getLocalDayRange(new Date(2026, 5, 6, 14, 30));

    expect(start).toEqual(new Date(2026, 5, 6, 0, 0, 0, 0));
    expect(end).toEqual(new Date(2026, 5, 7, 0, 0, 0, 0));
  });

  it('builds weekly and monthly ranges with exclusive end dates', () => {
    expect(getLocalRange('weekly', new Date(2026, 5, 6, 14, 30))).toEqual({
      start: new Date(2026, 4, 31, 0, 0, 0, 0),
      end: new Date(2026, 5, 7, 0, 0, 0, 0),
    });
    expect(getLocalRange('monthly', new Date(2026, 5, 6, 14, 30))).toEqual({
      start: new Date(2026, 5, 1, 0, 0, 0, 0),
      end: new Date(2026, 6, 1, 0, 0, 0, 0),
    });
  });

  it('converts second and millisecond timestamps', () => {
    expect(timestampToDate(1_700_000_000)?.getTime()).toBe(1_700_000_000_000);
    expect(timestampToDate('1700000000000')?.getTime()).toBe(1_700_000_000_000);
    expect(timestampToDate('not-a-date')).toBeNull();
  });

  it('treats ranges as inclusive start and exclusive end', () => {
    const start = new Date(2026, 5, 6);
    const end = new Date(2026, 5, 7);

    expect(isWithinRange(start, start, end)).toBe(true);
    expect(isWithinRange(new Date(end.getTime() - 1), start, end)).toBe(true);
    expect(isWithinRange(end, start, end)).toBe(false);
  });

  it('formats labels for all range modes', () => {
    expect(rangeLabel('daily')).toBe('Daily');
    expect(rangeLabel('weekly')).toBe('Weekly');
    expect(rangeLabel('monthly')).toBe('Monthly');
    expect(formatRange('monthly', new Date(2026, 5, 1), new Date(2026, 6, 1))).toContain('2026');
  });
});
