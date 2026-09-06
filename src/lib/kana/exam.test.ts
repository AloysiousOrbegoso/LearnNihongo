import { describe, expect, it } from 'vitest';
import { getKanaSet } from '@/lib/content/kana';
import {
  CHOICE_COUNT,
  MASTERY_STREAK_THRESHOLD,
  buildQuestion,
  gradeAnswer,
  nextMasteryState,
  pickExamCharacters,
  type MasteryState,
} from './exam';

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('pickExamCharacters', () => {
  it('returns the requested number of distinct characters', () => {
    const picked = pickExamCharacters('hiragana', 10, new Map(), seededRandom(1));
    expect(picked).toHaveLength(10);
    expect(new Set(picked.map((k) => k.character)).size).toBe(10);
  });

  it('clamps to the pool size when asked for more than exists', () => {
    const poolSize = getKanaSet('hiragana').length;
    const picked = pickExamCharacters('hiragana', poolSize + 50, new Map(), seededRandom(2));
    expect(picked).toHaveLength(poolSize);
  });

  it('is deterministic for the same random sequence', () => {
    const a = pickExamCharacters('katakana', 15, new Map(), seededRandom(42));
    const b = pickExamCharacters('katakana', 15, new Map(), seededRandom(42));
    expect(a).toEqual(b);
  });

  it('favors unmastered characters over mastered ones across many draws', () => {
    const pool = getKanaSet('hiragana');
    const mastery = new Map<string, MasteryState>();
    for (const entry of pool) {
      mastery.set(entry.character, { correctStreak: 5, mastered: true });
    }
    const unmastered = pool[0].character;
    mastery.set(unmastered, { correctStreak: 0, mastered: false });

    const random = seededRandom(12345);
    let unmasteredCount = 0;
    const trials = 500;
    for (let i = 0; i < trials; i += 1) {
      const picked = pickExamCharacters('hiragana', 1, mastery, random);
      if (picked[0].character === unmastered) unmasteredCount += 1;
    }

    expect(unmasteredCount).toBeGreaterThan(trials / pool.length);
  });
});

describe('buildQuestion', () => {
  it('includes exactly one correct choice among CHOICE_COUNT options with no duplicates', () => {
    const entry = getKanaSet('hiragana').find((k) => k.character === 'じ')!;
    const question = buildQuestion(entry, 'hiragana', seededRandom(7));

    expect(question.choices).toHaveLength(CHOICE_COUNT);
    expect(new Set(question.choices).size).toBe(CHOICE_COUNT);
    expect(question.choices).toContain(entry.romaji);
  });

  it('never produces duplicate-romaji decoys even for characters sharing a romaji reading', () => {
    for (let seed = 0; seed < 50; seed += 1) {
      const entry = getKanaSet('hiragana').find((k) => k.character === 'づ')!;
      const question = buildQuestion(entry, 'hiragana', seededRandom(seed));
      expect(new Set(question.choices).size).toBe(question.choices.length);
    }
  });
});

describe('gradeAnswer', () => {
  it('grades a correct answer', () => {
    const result = gradeAnswer('hiragana', 'あ', 'a');
    expect(result).toEqual({ character: 'あ', selected: 'a', correct: true, correctRomaji: 'a' });
  });

  it('grades an incorrect answer', () => {
    const result = gradeAnswer('hiragana', 'あ', 'i');
    expect(result?.correct).toBe(false);
  });

  it('returns null for a character not in the given script', () => {
    expect(gradeAnswer('hiragana', 'ア', 'a')).toBeNull();
  });
});

describe('nextMasteryState', () => {
  it('resets the streak on a wrong answer, even if previously mastered', () => {
    const state = nextMasteryState({ correctStreak: 5, mastered: true }, false);
    expect(state).toEqual({ correctStreak: 0, mastered: false });
  });

  it('increments the streak on a correct answer and masters at the threshold', () => {
    let state: MasteryState | undefined;
    for (let i = 0; i < MASTERY_STREAK_THRESHOLD; i += 1) {
      state = nextMasteryState(state, true);
    }
    expect(state).toEqual({ correctStreak: MASTERY_STREAK_THRESHOLD, mastered: true });
  });

  it('treats a missing prior state as a zero streak', () => {
    expect(nextMasteryState(undefined, true)).toEqual({ correctStreak: 1, mastered: false });
  });
});
