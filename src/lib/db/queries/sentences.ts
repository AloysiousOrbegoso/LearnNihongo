import { and, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { sentenceExams, sentenceMastery } from '@/lib/db/schema';
import { pointKeysForTier, type SentenceTier } from '@/lib/content/sentences';
import {
  gradeConnectorAnswer,
  gradeSlotFillAnswer,
  nextMasteryState,
  pointKeyForGraded,
  type GradedItem,
  type MasteryState,
} from '@/lib/sentences/exam';

export async function getMasteryMap(
  userId: string,
  tier: SentenceTier,
): Promise<Map<string, MasteryState>> {
  const rows = await db
    .select({
      pointKey: sentenceMastery.pointKey,
      correctStreak: sentenceMastery.correctStreak,
      mastered: sentenceMastery.mastered,
    })
    .from(sentenceMastery)
    .where(and(eq(sentenceMastery.userId, userId), eq(sentenceMastery.tier, tier)));

  return new Map(
    rows.map((row) => [row.pointKey, { correctStreak: row.correctStreak, mastered: row.mastered }]),
  );
}

export interface TierProgress {
  masteredCount: number;
  total: number;
  unlocked: boolean;
}

export async function getTierProgress(userId: string): Promise<Record<SentenceTier, TierProgress>> {
  const tiers: SentenceTier[] = ['simple', 'compound', 'complex'];
  const progress = {} as Record<SentenceTier, TierProgress>;

  for (const tier of tiers) {
    const points = pointKeysForTier(tier);
    const mastery = await getMasteryMap(userId, tier);
    const masteredCount = points.filter((key) => mastery.get(key)?.mastered).length;
    progress[tier] = { masteredCount, total: points.length, unlocked: false };
  }

  progress.simple.unlocked = true;
  progress.compound.unlocked = progress.simple.masteredCount === progress.simple.total;
  progress.complex.unlocked =
    progress.compound.unlocked && progress.compound.masteredCount === progress.compound.total;

  return progress;
}

export interface SubmitSentenceExamResult {
  results: GradedItem[];
  correctCount: number;
  total: number;
}

export async function submitExam({
  userId,
  tier,
  answers,
  now,
}: {
  userId: string;
  tier: SentenceTier;
  answers:
    | { kind: 'slotfill'; templateId: string; selectedId: string }[]
    | { kind: 'connector'; id: string; selected: string }[];
  now: Date;
}): Promise<SubmitSentenceExamResult | null> {
  const graded = answers.map((answer) =>
    answer.kind === 'slotfill'
      ? gradeSlotFillAnswer(answer.templateId, answer.selectedId)
      : gradeConnectorAnswer(answer.id, answer.selected),
  );
  if (graded.some((result) => result === null)) return null;
  const results = graded as GradedItem[];

  const validPointKeys = new Set(pointKeysForTier(tier));
  if (results.some((result) => !validPointKeys.has(pointKeyForGraded(result)))) return null;

  const mastery = await getMasteryMap(userId, tier);

  await db.transaction(async (tx) => {
    for (const result of results) {
      const pointKey = pointKeyForGraded(result);
      const current = mastery.get(pointKey);
      const next = nextMasteryState(current, result.correct);

      await tx
        .insert(sentenceMastery)
        .values({
          userId,
          tier,
          pointKey,
          correctStreak: next.correctStreak,
          mastered: next.mastered,
          lastTestedAt: now,
        })
        .onConflictDoUpdate({
          target: [sentenceMastery.userId, sentenceMastery.tier, sentenceMastery.pointKey],
          set: {
            correctStreak: next.correctStreak,
            mastered: next.mastered,
            lastTestedAt: now,
          },
        });
    }

    await tx.insert(sentenceExams).values({
      userId,
      tier,
      correctCount: results.filter((r) => r.correct).length,
      total: results.length,
      takenAt: now,
    });
  });

  return {
    results,
    correctCount: results.filter((r) => r.correct).length,
    total: results.length,
  };
}
