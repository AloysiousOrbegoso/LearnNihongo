import { describe, expect, it } from 'vitest';
import { CONNECTOR_EXERCISES, SLOT_TEMPLATES } from '@/lib/content/sentences';
import { classifyWord } from '@/lib/sentences/vocabPools';
import {
  MASTERY_STREAK_THRESHOLD,
  buildExam,
  buildSlotFillExample,
  buildSlotFillQuestion,
  gradeConnectorAnswer,
  gradeSlotFillAnswer,
  nextMasteryState,
  pointKeyForGraded,
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

const WA_DESU = SLOT_TEMPLATES.find((t) => t.id === 'wa-desu')!;
const GA_SUKI = SLOT_TEMPLATES.find((t) => t.id === 'ga-suki')!;

describe('buildSlotFillQuestion', () => {
  it('produces exactly 4 distinct choices, one of which is grammatically correct', () => {
    for (const template of SLOT_TEMPLATES) {
      const question = buildSlotFillQuestion(template, seededRandom(1));
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices.map((c) => c.id)).size).toBe(4);

      const correctCount = question.choices.filter((c) => {
        const category = classifyWord(c.id);
        return category !== null && template.correctCategories.includes(category as never);
      }).length;
      expect(correctCount).toBe(1);
    }
  });

  it('leaves a blank marker in both the Japanese and English text', () => {
    const question = buildSlotFillQuestion(WA_DESU, seededRandom(2));
    expect(question.jp).toContain('＿');
    expect(question.en).toContain('___');
  });

  it('is deterministic for the same random sequence', () => {
    const a = buildSlotFillQuestion(GA_SUKI, seededRandom(42));
    const b = buildSlotFillQuestion(GA_SUKI, seededRandom(42));
    expect(a).toEqual(b);
  });
});

describe('buildSlotFillExample', () => {
  it('fills in a complete, readable sentence with no blank markers', () => {
    for (const template of SLOT_TEMPLATES) {
      const example = buildSlotFillExample(template, seededRandom(3));
      expect(example.jp).not.toContain('＿');
      expect(example.en).not.toContain('___');
      expect(example.jp.length).toBeGreaterThan(2);
    }
  });
});

describe('buildExam', () => {
  it('generates 10 slot-fill questions for the simple tier', () => {
    const exam = buildExam('simple', seededRandom(4));
    expect(exam).toHaveLength(10);
    expect(exam.every((q) => q.kind === 'slotfill')).toBe(true);
  });

  it('covers the entire compound-tier pool for connector questions', () => {
    const exam = buildExam('compound', seededRandom(5));
    const compoundPool = CONNECTOR_EXERCISES.filter((e) => e.tier === 'compound');
    expect(exam).toHaveLength(compoundPool.length);
    expect(exam.every((q) => q.kind === 'connector')).toBe(true);
  });
});

describe('gradeSlotFillAnswer', () => {
  it('grades a correct noun answer for ga-suki', () => {
    const question = buildSlotFillQuestion(GA_SUKI, seededRandom(6));
    const correctChoice = question.choices.find(
      (c) =>
        classifyWord(c.id) !== null &&
        GA_SUKI.correctCategories.includes(classifyWord(c.id) as never),
    )!;
    const result = gradeSlotFillAnswer('ga-suki', correctChoice.id);
    expect(result?.correct).toBe(true);
  });

  it('grades an incorrect answer', () => {
    const question = buildSlotFillQuestion(GA_SUKI, seededRandom(7));
    const wrongChoice = question.choices.find(
      (c) =>
        classifyWord(c.id) === null ||
        !GA_SUKI.correctCategories.includes(classifyWord(c.id) as never),
    )!;
    const result = gradeSlotFillAnswer('ga-suki', wrongChoice.id);
    expect(result?.correct).toBe(false);
  });

  it('returns null for an unknown template', () => {
    expect(gradeSlotFillAnswer('bogus-template', 'anything')).toBeNull();
  });

  it('returns null for an unknown word id', () => {
    expect(gradeSlotFillAnswer('ga-suki', 'not-a-real-id')).toBeNull();
  });
});

describe('gradeConnectorAnswer', () => {
  it('grades a correct answer', () => {
    const exercise = CONNECTOR_EXERCISES[0];
    const result = gradeConnectorAnswer(exercise.id, exercise.correct);
    expect(result).toEqual({
      kind: 'connector',
      id: exercise.id,
      connector: exercise.connector,
      correct: true,
      correctSentence: exercise.correct,
    });
  });

  it('grades an incorrect answer', () => {
    const exercise = CONNECTOR_EXERCISES[0];
    const result = gradeConnectorAnswer(exercise.id, exercise.decoys[0]);
    expect(result?.correct).toBe(false);
  });

  it('returns null for an unknown id', () => {
    expect(gradeConnectorAnswer('bogus', 'x')).toBeNull();
  });
});

describe('pointKeyForGraded', () => {
  it('maps slotfill items to the shared word-order key', () => {
    const question = buildSlotFillQuestion(GA_SUKI, seededRandom(8));
    const graded = gradeSlotFillAnswer('ga-suki', question.choices[0].id)!;
    expect(pointKeyForGraded(graded)).toBe('word-order');
  });

  it('maps connector items to their own connector id', () => {
    const exercise = CONNECTOR_EXERCISES[0];
    const graded = gradeConnectorAnswer(exercise.id, exercise.correct)!;
    expect(pointKeyForGraded(graded)).toBe(exercise.connector);
  });
});

describe('nextMasteryState', () => {
  it('resets the streak on a wrong answer, even if previously mastered', () => {
    expect(nextMasteryState({ correctStreak: 5, mastered: true }, false)).toEqual({
      correctStreak: 0,
      mastered: false,
    });
  });

  it('increments the streak and masters at the threshold', () => {
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
