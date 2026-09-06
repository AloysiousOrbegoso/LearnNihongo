import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getUserDecksWithCounts } from '@/lib/db/queries/decks';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { getTierProgress } from '@/lib/db/queries/sentences';
import { getProfile } from '@/lib/db/queries/profiles';
import { LinkCard } from '@/components/ui/Card';
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
  const kanaComplete = kanaMastered === kanaTotal;
  const sentenceMastered =
    sentenceProgress.simple.masteredCount +
    sentenceProgress.compound.masteredCount +
    sentenceProgress.complex.masteredCount;
  const sentenceTotal =
    sentenceProgress.simple.total +
    sentenceProgress.compound.total +
    sentenceProgress.complex.total;
  const name = profile?.displayName;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-3xl font-extrabold">
        {profile?.avatar && (
          <span className="mr-2" aria-hidden>
            {profile.avatar}
          </span>
        )}
        {name ? `Welcome back, ${name}` : 'Home'}
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <LinkCard href="/review" className="flex flex-col gap-2">
          <span className="text-2xl" aria-hidden>
            📚
          </span>
          <span className="text-foreground font-bold">Review</span>
          {totalDue > 0 ? (
            <Badge tone="accent" className="self-start">
              {totalDue} due
            </Badge>
          ) : (
            <span className="text-muted text-sm">All caught up</span>
          )}
        </LinkCard>
        <LinkCard href="/kana" className="flex flex-col gap-2">
          <span className="text-2xl" aria-hidden>
            🈴
          </span>
          <span className="text-foreground font-bold">Kana Practice</span>
          <span className="text-muted text-sm">
            {kanaMastered} / {kanaTotal} mastered
          </span>
          <ProgressBar value={kanaMastered} max={kanaTotal} tone="success" />
        </LinkCard>
        <LinkCard href="/sentences" className="flex flex-col gap-2">
          <span className="text-2xl" aria-hidden>
            🧩
          </span>
          <span className="text-foreground font-bold">Sentence Builder</span>
          {kanaComplete ? (
            <>
              <span className="text-muted text-sm">
                {sentenceMastered} / {sentenceTotal} mastered
              </span>
              <ProgressBar value={sentenceMastered} max={sentenceTotal} />
            </>
          ) : (
            <Badge tone="muted" className="self-start">
              Locked — finish kana
            </Badge>
          )}
        </LinkCard>
        <LinkCard href="/trivia" className="flex flex-col gap-2">
          <span className="text-2xl" aria-hidden>
            🎴
          </span>
          <span className="text-foreground font-bold">Daily Trivia</span>
          <span className="text-muted text-sm">Today&apos;s word</span>
        </LinkCard>
        <LinkCard href="/decks" className="flex flex-col gap-2">
          <span className="text-2xl" aria-hidden>
            🗂️
          </span>
          <span className="text-foreground font-bold">Decks</span>
          <span className="text-muted text-sm">
            {decks.length} deck{decks.length === 1 ? '' : 's'}
          </span>
        </LinkCard>
        <LinkCard href="/kanji" className="flex flex-col gap-2">
          <span className="text-2xl" aria-hidden>
            🈶
          </span>
          <span className="text-foreground font-bold">Browse Kanji</span>
          <span className="text-muted text-sm">Dictionary</span>
        </LinkCard>
        <LinkCard href="/vocab" className="flex flex-col gap-2">
          <span className="text-2xl" aria-hidden>
            📖
          </span>
          <span className="text-foreground font-bold">Browse Vocab</span>
          <span className="text-muted text-sm">Dictionary</span>
        </LinkCard>
      </div>
    </div>
  );
}
