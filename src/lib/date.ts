import type { RangeMode } from '../types/game';

export function getLocalDayRange(now = new Date()): { start: Date; end: Date } {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
}

export function getLocalRange(mode: RangeMode, now = new Date()): { start: Date; end: Date } {
  if (mode === 'daily') return getLocalDayRange(now);

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (mode === 'weekly') {
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { start, end };
  }

  start.setDate(1);
  const end = new Date(start);
  end.setMonth(start.getMonth() + 1);
  return { start, end };
}

export function timestampToDate(value: number | string | undefined): Date | null {
  if (value === undefined || value === null || value === '') return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  const millis = numeric > 10_000_000_000 ? numeric : numeric * 1000;
  const date = new Date(millis);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const time = date.getTime();
  return time >= start.getTime() && time < end.getTime();
}

export function formatDayRange(start: Date, end: Date): string {
  const date = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(start);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${date}, ${time.format(start)}-${time.format(end)}`;
}

export function formatRange(mode: RangeMode, start: Date, end: Date): string {
  if (mode === 'daily') return formatDayRange(start, end);

  if (mode === 'weekly') {
    const date = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const inclusiveEnd = new Date(end.getTime() - 1);
    return `${date.format(start)}-${date.format(inclusiveEnd)}`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(start);
}

export function rangeLabel(mode: RangeMode): string {
  if (mode === 'weekly') return 'Weekly';
  if (mode === 'monthly') return 'Monthly';
  return 'Daily';
}
