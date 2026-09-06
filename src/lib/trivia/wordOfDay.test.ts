import { describe, expect, it } from 'vitest';
import { hashString, wordOfDayIndex } from './wordOfDay';

describe('hashString', () => {
  it('is deterministic for the same input', () => {
    expect(hashString('2026-09-06')).toBe(hashString('2026-09-06'));
  });

  it('differs for different inputs', () => {
    expect(hashString('2026-09-06')).not.toBe(hashString('2026-09-07'));
  });

  it('always returns a non-negative integer', () => {
    for (const day of ['2026-01-01', '2026-12-31', '', 'x']) {
      const hash = hashString(day);
      expect(Number.isInteger(hash)).toBe(true);
      expect(hash).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('wordOfDayIndex', () => {
  it('is always within range', () => {
    for (let i = 0; i < 100; i += 1) {
      const day = `2026-01-${String((i % 28) + 1).padStart(2, '0')}`;
      const index = wordOfDayIndex(day, 22636);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThan(22636);
    }
  });

  it('is deterministic for the same day and pool size', () => {
    expect(wordOfDayIndex('2026-09-06', 500)).toBe(wordOfDayIndex('2026-09-06', 500));
  });

  it('changes across consecutive days for a reasonable pool size', () => {
    const indexes = new Set<number>();
    for (let i = 1; i <= 30; i += 1) {
      indexes.add(wordOfDayIndex(`2026-01-${String(i).padStart(2, '0')}`, 500));
    }
    expect(indexes.size).toBeGreaterThan(1);
  });

  it('returns 0 for an empty pool', () => {
    expect(wordOfDayIndex('2026-09-06', 0)).toBe(0);
  });
});
