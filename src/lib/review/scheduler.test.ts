import { describe, expect, it } from 'vitest';
import { Rating, State } from 'ts-fsrs';
import {
  formatInterval,
  isGrade,
  previewIntervals,
  scheduleReview,
  type SchedulableCard,
} from './scheduler';

const NOW = new Date('2026-09-03T00:00:00.000Z');

function newCard(): SchedulableCard {
  return {
    due: NOW,
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    learningSteps: 0,
    reps: 0,
    lapses: 0,
    state: State.New,
    lastReview: null,
  };
}

describe('scheduleReview', () => {
  it('moves a new card out of the New state and schedules it in the future', () => {
    const { card, log } = scheduleReview(newCard(), Rating.Good, NOW);

    expect(card.state).not.toBe(State.New);
    expect(card.due.getTime()).toBeGreaterThan(NOW.getTime());
    expect(card.reps).toBe(1);
    expect(card.lastReview?.getTime()).toBe(NOW.getTime());
    expect(log.rating).toBe(Rating.Good);
    expect(log.state).toBe(State.New);
    expect(log.reviewedAt.getTime()).toBe(NOW.getTime());
  });

  it('schedules Easy further out than Again', () => {
    const again = scheduleReview(newCard(), Rating.Again, NOW);
    const easy = scheduleReview(newCard(), Rating.Easy, NOW);

    expect(easy.card.due.getTime()).toBeGreaterThan(again.card.due.getTime());
    expect(easy.card.state).toBe(State.Review);
  });

  it('counts a lapse when a Review card is forgotten', () => {
    const learned = scheduleReview(newCard(), Rating.Easy, NOW).card;
    const later = new Date(learned.due.getTime() + 60_000);
    const { card } = scheduleReview(learned, Rating.Again, later);

    expect(card.lapses).toBe(1);
    expect(card.state).toBe(State.Relearning);
  });

  it('is deterministic for the same input', () => {
    const first = scheduleReview(newCard(), Rating.Good, NOW);
    const second = scheduleReview(newCard(), Rating.Good, NOW);

    expect(second).toEqual(first);
  });

  it('does not mutate the input card', () => {
    const input = newCard();
    scheduleReview(input, Rating.Good, NOW);

    expect(input).toEqual(newCard());
  });
});

describe('previewIntervals', () => {
  it('returns a label for every grade', () => {
    const intervals = previewIntervals(newCard(), NOW);

    expect(Object.keys(intervals).map(Number).sort()).toEqual([1, 2, 3, 4]);
    for (const label of Object.values(intervals)) {
      expect(label).toMatch(/^\d+(m|h|d|mo|y)$/);
    }
  });
});

describe('isGrade', () => {
  it('accepts 1 through 4 only', () => {
    expect(isGrade(0)).toBe(false);
    expect(isGrade(1)).toBe(true);
    expect(isGrade(4)).toBe(true);
    expect(isGrade(5)).toBe(false);
  });
});

describe('formatInterval', () => {
  it('formats the interval at a sensible unit', () => {
    expect(formatInterval(10_000)).toBe('1m');
    expect(formatInterval(10 * 60_000)).toBe('10m');
    expect(formatInterval(3 * 3_600_000)).toBe('3h');
    expect(formatInterval(4 * 86_400_000)).toBe('4d');
    expect(formatInterval(45 * 86_400_000)).toBe('2mo');
    expect(formatInterval(400 * 86_400_000)).toBe('1y');
  });
});
