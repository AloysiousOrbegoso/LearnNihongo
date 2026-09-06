import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { getTierProgress } from '@/lib/db/queries/sentences';
import type { SentenceTier } from '@/lib/content/sentences';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
        <h1 className="text-foreground text-3xl font-extrabold">Sentence Builder</h1>
        <div className="card-shadow border-border bg-surface flex flex-col items-center gap-4 rounded-2xl border px-6 py-12 text-center">
          <span className="text-4xl" aria-hidden>
            🔒
          </span>
          <p className="text-foreground text-lg font-bold">Master hiragana and katakana first.</p>
          <p className="text-muted text-sm">
            {kanaMastered} / {kanaTotal} kana mastered. Sentence Builder unlocks once both scripts
            are fully mastered.
          </p>
          <LinkButton href="/kana">Go to Kana Practice</LinkButton>
        </div>
      </div>
    );
  }

  const progress = await getTierProgress(user.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-foreground text-3xl font-extrabold">Sentence Builder</h1>
      {TIERS.map(({ key, label, blurb }) => {
        const tier = progress[key];
        const percent = tier.total === 0 ? 0 : Math.round((tier.masteredCount / tier.total) * 100);

        return (
          <Card key={key} className={`flex flex-col gap-4 ${!tier.unlocked ? 'opacity-70' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-lg font-bold">{label}</h2>
              {tier.unlocked ? (
                <span className="text-muted text-sm">
                  {tier.masteredCount} / {tier.total} mastered ({percent}%)
                </span>
              ) : (
                <Badge tone="muted">Locked</Badge>
              )}
            </div>
            <p className="text-muted text-sm">{blurb}</p>
            {tier.unlocked ? (
              <>
                <ProgressBar value={tier.masteredCount} max={tier.total} />
                <div className="flex flex-wrap items-center gap-3">
                  <LinkButton href={`/sentences/${key}/practice`} variant="ghost" size="sm">
                    Practice
                  </LinkButton>
                  <LinkButton href={`/sentences/${key}/exam`} size="sm">
                    Exam
                  </LinkButton>
                </div>
              </>
            ) : (
              <p className="text-muted text-xs">
                Unlocks once the previous tier is fully mastered.
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
