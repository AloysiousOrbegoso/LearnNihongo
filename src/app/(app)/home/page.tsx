import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getUserDecksWithCounts } from '@/lib/db/queries/decks';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { getTierProgress } from '@/lib/db/queries/sentences';
import { getProfile } from '@/lib/db/queries/profiles';
import { LinkButton } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Home',
};

export default async function HomePage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const now = new Date();
  const [decks, kana, sentenceProgress, profile] = await Promise.all([
    getUserDecksWithCounts({ userId: user.id, now }),
    getMasterySummary(user.id),
    getTierProgress(user.id),
    getProfile(user.id),
  ]);

  const totalDue = decks.reduce((sum, deck) => sum + deck.dueCount, 0);
  const kanaMastered = kana.hiragana.mastered + kana.katakana.mastered;
  const kanaTotal = kana.hiragana.total + kana.katakana.total;
  const kanaComplete = kanaTotal > 0 && kanaMastered === kanaTotal;
  const sentenceMastered =
    sentenceProgress.simple.masteredCount +
    sentenceProgress.compound.masteredCount +
    sentenceProgress.complex.masteredCount;
  const sentenceTotal =
    sentenceProgress.simple.total +
    sentenceProgress.compound.total +
    sentenceProgress.complex.total;
  const name = profile?.displayName;
  const deckCount = decks.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline gap-2">
        {profile?.avatar && <span aria-hidden>{profile.avatar}</span>}
        <h1 className="display-2">{name ? `Welcome back, ${name}` : 'Home'}</h1>
      </div>

      <section className="on-ink relative overflow-hidden rounded-lg p-6 sm:p-8">
        <span
          aria-hidden
          className="font-jp pointer-events-none absolute top-[-2.5rem] right-[-1rem] text-[8.5rem] leading-none text-white/5 select-none"
        >
          復
        </span>
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-accent">
              {totalDue > 0 ? 'Due now' : 'All caught up'}
            </span>
            {totalDue > 0 ? (
              <div className="flex items-baseline gap-2.5">
                <span className="display-1 leading-none">{totalDue}</span>
                <span className="text-muted text-sm">
                  card{totalDue === 1 ? '' : 's'} across {deckCount} deck
                  {deckCount === 1 ? '' : 's'}
                </span>
              </div>
            ) : (
              <p className="text-muted max-w-xs text-sm">
                Nothing due right now. Come back later, or keep your kana sharp in the meantime.
              </p>
            )}
          </div>
          <LinkButton
            href={totalDue > 0 ? '/review' : '/kana'}
            variant="primary"
            size="lg"
            className="flex-shrink-0"
          >
            {totalDue > 0 ? 'Start review' : 'Practice kana'}
          </LinkButton>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <span className="bg-accent h-0.5 w-6" aria-hidden />
          <span className="eyebrow text-accent">Practice</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <a
            href="/kana"
            className="border-border bg-surface hover:border-border-strong flex flex-col gap-2 rounded-lg border p-4 transition-colors"
          >
            <span className="text-foreground text-sm font-medium">Kana</span>
            <span className="text-subtle text-xs">
              {kanaMastered} of {kanaTotal} mastered
            </span>
            <ProgressBar value={kanaMastered} max={kanaTotal} tone="success" />
          </a>

          {kanaComplete ? (
            <a
              href="/sentences"
              className="border-border bg-surface hover:border-border-strong flex flex-col gap-2 rounded-lg border p-4 transition-colors"
            >
              <span className="text-foreground text-sm font-medium">Sentences</span>
              <span className="text-subtle text-xs">
                {sentenceMastered} of {sentenceTotal} mastered
              </span>
              <ProgressBar value={sentenceMastered} max={sentenceTotal} />
            </a>
          ) : (
            <div className="border-border bg-surface-sunken flex flex-col gap-2 rounded-lg border p-4 opacity-70">
              <span className="text-muted text-sm font-medium">Sentences</span>
              <Badge tone="muted" className="w-fit">
                Locked — finish kana
              </Badge>
            </div>
          )}

          <a
            href="/trivia"
            className="border-border bg-surface hover:border-border-strong flex flex-col justify-between gap-2 rounded-lg border p-4 transition-colors"
          >
            <span className="text-foreground text-sm font-medium">Daily trivia</span>
            <span className="text-subtle text-xs">Today&apos;s word, ungraded</span>
          </a>
        </div>
      </section>

      <nav className="border-border divide-border grid grid-cols-2 divide-x divide-y overflow-hidden rounded-lg border sm:grid-cols-4 sm:divide-y-0">
        {[
          { href: '/decks', label: `Decks (${deckCount})` },
          { href: '/stats', label: 'Stats' },
          { href: '/kanji', label: 'Kanji' },
          { href: '/vocab', label: 'Vocab' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-muted hover:text-foreground hover:bg-surface-sunken px-4 py-3.5 text-center text-sm transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
