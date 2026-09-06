import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getVerifiedUser } from '@/lib/auth/session';
import { getTierProgress } from '@/lib/db/queries/sentences';
import { SentencePractice } from '@/components/features/SentencePractice';
import type { SentenceTier } from '@/lib/content/sentences';
import { buildRandomSlotFillExample } from '@/lib/sentences/exam';

export const metadata: Metadata = {
  title: 'Sentence Practice',
};

const VALID_TIERS: readonly SentenceTier[] = ['simple', 'compound', 'complex'];
const SIMPLE_PRACTICE_COUNT = 15;

function isTier(value: string): value is SentenceTier {
  return (VALID_TIERS as readonly string[]).includes(value);
}

export default async function SentencePracticePage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const { tier } = await params;
  if (!isTier(tier)) notFound();

  const progress = await getTierProgress(user.id);
  if (!progress[tier].unlocked) redirect('/sentences');

  const simpleExamples =
    tier === 'simple'
      ? Array.from({ length: SIMPLE_PRACTICE_COUNT }, () => buildRandomSlotFillExample())
      : undefined;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-3xl font-extrabold capitalize">{tier} Practice</h1>
      <SentencePractice tier={tier} simpleExamples={simpleExamples} />
    </div>
  );
}
