import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getVerifiedUser } from '@/lib/auth/session';
import { getTierProgress } from '@/lib/db/queries/sentences';
import { SentenceExamSession } from '@/components/features/SentenceExamSession';
import type { SentenceTier } from '@/lib/content/sentences';

export const metadata: Metadata = {
  title: 'Sentence Exam',
};

const VALID_TIERS: readonly SentenceTier[] = ['simple', 'compound', 'complex'];

function isTier(value: string): value is SentenceTier {
  return (VALID_TIERS as readonly string[]).includes(value);
}

export default async function SentenceExamPage({ params }: { params: Promise<{ tier: string }> }) {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const { tier } = await params;
  if (!isTier(tier)) notFound();

  const progress = await getTierProgress(user.id);
  if (!progress[tier].unlocked) redirect('/sentences');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-2xl font-semibold capitalize">{tier} Exam</h1>
      <SentenceExamSession tier={tier} />
    </div>
  );
}
