import { describe, expect, it } from 'vitest';
import { formatDay, isValidTimezone, resolveTimezone, shiftDay } from './timezone';

describe('isValidTimezone', () => {
  it('accepts IANA zones and rejects garbage', () => {
    expect(isValidTimezone('Asia/Tokyo')).toBe(true);
    expect(isValidTimezone('UTC')).toBe(true);
    expect(isValidTimezone('Not/AZone')).toBe(false);
    expect(isValidTimezone('')).toBe(false);
  });
});

describe('resolveTimezone', () => {
  it('falls back to UTC', () => {
    expect(resolveTimezone('Asia/Manila')).toBe('Asia/Manila');
    expect(resolveTimezone('bogus')).toBe('UTC');
    expect(resolveTimezone(null)).toBe('UTC');
  });
});

describe('formatDay', () => {
  it('formats the calendar day in the given zone', () => {
    const instant = new Date('2026-09-03T20:30:00.000Z');
    expect(formatDay(instant, 'UTC')).toBe('2026-09-03');
    expect(formatDay(instant, 'Asia/Tokyo')).toBe('2026-09-04');
  });
});

describe('shiftDay', () => {
  it('moves across month and year boundaries', () => {
    expect(shiftDay('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDay('2026-09-03', 0)).toBe('2026-09-03');
  });
});
