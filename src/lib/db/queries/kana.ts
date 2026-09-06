import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { kanaExams, kanaMastery } from '@/lib/db/schema';
import { getKanaSet, type KanaScript } from '@/lib/content/kana';
import {
  gradeAnswer,
  nextMasteryState,
  type GradedAnswer,
  type MasteryState,
} from '@/lib/kana/exam';

export async function getMasteryMap(
  userId: string,
  script: KanaScript,
): Promise<Map<string, MasteryState>> {
  const rows = await db
    .select({
      character: kanaMastery.character,
      correctStreak: kanaMastery.correctStreak,
      mastered: kanaMastery.mastered,
    })
    .from(kanaMastery)
    .where(and(eq(kanaMastery.userId, userId), eq(kanaMastery.script, script)));

  return new Map(
    rows.map((row) => [
      row.character,
      { correctStreak: row.correctStreak, mastered: row.mastered },
    ]),
  );
}

export async function getMasterySummary(userId: string) {
  const scripts: KanaScript[] = ['hiragana', 'katakana'];
  const summary: Record<KanaScript, { mastered: number; total: number }> = {
    hiragana: { mastered: 0, total: getKanaSet('hiragana').length },
    katakana: { mastered: 0, total: getKanaSet('katakana').length },
  };

  for (const script of scripts) {
    const rows = await db
      .select({ mastered: kanaMastery.mastered })
      .from(kanaMastery)
      .where(and(eq(kanaMastery.userId, userId), eq(kanaMastery.script, script)));
    summary[script].mastered = rows.filter((row) => row.mastered).length;
  }

  return summary;
}

export interface SubmitExamResult {
  results: GradedAnswer[];
  correctCount: number;
  total: number;
}

export async function submitExam({
  userId,
  script,
  answers,
  now,
}: {
  userId: string;
  script: KanaScript;
  answers: { character: string; selected: string }[];
  now: Date;
}): Promise<SubmitExamResult | null> {
  const graded = answers.map((answer) => gradeAnswer(script, answer.character, answer.selected));
  if (graded.some((result) => result === null)) return null;
  const results = graded as GradedAnswer[];

  const mastery = await getMasteryMap(userId, script);

  await db.transaction(async (tx) => {
    for (const result of results) {
      const current = mastery.get(result.character);
      const next = nextMasteryState(current, result.correct);

      await tx
        .insert(kanaMastery)
        .values({
          userId,
          script,
          character: result.character,
          correctStreak: next.correctStreak,
          mastered: next.mastered,
          attempts: 1,
          correctCount: result.correct ? 1 : 0,
          lastTestedAt: now,
        })
        .onConflictDoUpdate({
          target: [kanaMastery.userId, kanaMastery.script, kanaMastery.character],
          set: {
            correctStreak: next.correctStreak,
            mastered: next.mastered,
            attempts: sql`${kanaMastery.attempts} + 1`,
            correctCount: sql`${kanaMastery.correctCount} + ${result.correct ? 1 : 0}`,
            lastTestedAt: now,
          },
        });
    }

    await tx.insert(kanaExams).values({
      userId,
      script,
      size: results.length,
      correctCount: results.filter((r) => r.correct).length,
      takenAt: now,
    });
  });

  return {
    results,
    correctCount: results.filter((r) => r.correct).length,
    total: results.length,
  };
}
