import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { getTierProgress } from '@/lib/db/queries/sentences';
import type { SentenceTier } from '@/lib/content/sentences';

export const metadata: Metadata = {
  title: 'Sentence Builder',
};

const TIERS: { key: SentenceTier; label: string; blurb: string }[] = [
  {
    key: 'simple',
    label: 'Simple sentences',
    blurb: 'Pick the right kind of word to complete real sentences drawn from the dictionary.',
  },
  { key: 'compound', label: 'Compound sentences', blurb: 'Joining two clauses: て, し, けど.' },
  {
    key: 'complex',
    label: 'Complex sentences',
    blurb: 'Subordinate clauses: から, ので, とき, ば, たら, なら, のに.',
  },
];

export default async function SentencesPage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const kana = await getMasterySummary(user.id);
  const kanaComplete =
    kana.hiragana.mastered === kana.hiragana.total &&
    kana.katakana.mastered === kana.katakana.total;

  if (!kanaComplete) {
    const kanaMastered = kana.hiragana.mastered + kana.katakana.mastered;
    const kanaTotal = kana.hiragana.total + kana.katakana.total;

    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-foreground text-2xl font-semibold">Sentence Builder</h1>
        <div className="border-border bg-surface flex flex-col items-center gap-4 rounded-lg border px-6 py-12 text-center">
          <p className="text-foreground text-lg">Master hiragana and katakana first.</p>
          <p className="text-muted text-sm">
            {kanaMastered} / {kanaTotal} kana mastered. Sentence Builder unlocks once both scripts
            are fully mastered.
          </p>
          <Link href="/kana" className="bg-accent text-accent-foreground rounded-md px-4 py-2">
            Go to Kana Practice
          </Link>
        </div>
      </div>
    );
  }

  const progress = await getTierProgress(user.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-foreground text-2xl font-semibold">Sentence Builder</h1>
      {TIERS.map(({ key, label, blurb }) => {
        const tier = progress[key];
        const percent = tier.total === 0 ? 0 : Math.round((tier.masteredCount / tier.total) * 100);

        return (
          <section
            key={key}
            className="border-border bg-surface flex flex-col gap-4 rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-lg font-semibold">{label}</h2>
              {tier.unlocked ? (
                <span className="text-muted text-sm">
                  {tier.masteredCount} / {tier.total} mastered ({percent}%)
                </span>
              ) : (
                <span className="text-muted text-sm">Locked</span>
              )}
            </div>
            <p className="text-muted text-sm">{blurb}</p>
            {tier.unlocked ? (
              <>
                <div className="bg-background h-2 overflow-hidden rounded-full">
                  <div className="bg-accent h-full rounded-full" style={{ width: `${percent}%` }} />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/sentences/${key}/practice`}
                    className="border-border text-foreground rounded-md border px-3 py-1.5 text-sm"
                  >
                    Practice
                  </Link>
                  <Link
                    href={`/sentences/${key}/exam`}
                    className="bg-accent text-accent-foreground rounded-md px-3 py-1.5 text-sm"
                  >
                    Exam
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-muted text-xs">
                Unlocks once the previous tier is fully mastered.
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
