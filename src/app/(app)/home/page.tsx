import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getUserDecksWithCounts } from '@/lib/db/queries/decks';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { getTierProgress } from '@/lib/db/queries/sentences';

export const metadata: Metadata = {
  title: 'Home',
};

const cardClass =
  'flex flex-col gap-1 rounded-lg border border-border bg-surface p-5 hover:bg-background';

export default async function HomePage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const now = new Date();
  const [decks, kana, sentenceProgress] = await Promise.all([
    getUserDecksWithCounts({ userId: user.id, now }),
    getMasterySummary(user.id),
    getTierProgress(user.id),
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-2xl font-semibold">Home</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/review" className={cardClass}>
          <span className="text-foreground font-semibold">Review</span>
          <span className="text-muted text-sm">
            {totalDue} card{totalDue === 1 ? '' : 's'} due
          </span>
        </Link>
        <Link href="/kana" className={cardClass}>
          <span className="text-foreground font-semibold">Kana Practice</span>
          <span className="text-muted text-sm">
            {kanaMastered} / {kanaTotal} mastered
          </span>
        </Link>
        <Link href="/sentences" className={cardClass}>
          <span className="text-foreground font-semibold">Sentence Builder</span>
          <span className="text-muted text-sm">
            {kanaComplete
              ? `${sentenceMastered} / ${sentenceTotal} mastered`
              : 'Locked — finish kana'}
          </span>
        </Link>
        <Link href="/trivia" className={cardClass}>
          <span className="text-foreground font-semibold">Daily Trivia</span>
          <span className="text-muted text-sm">Today&apos;s word</span>
        </Link>
        <Link href="/decks" className={cardClass}>
          <span className="text-foreground font-semibold">Decks</span>
          <span className="text-muted text-sm">
            {decks.length} deck{decks.length === 1 ? '' : 's'}
          </span>
        </Link>
        <Link href="/kanji" className={cardClass}>
          <span className="text-foreground font-semibold">Browse Kanji</span>
          <span className="text-muted text-sm">Dictionary</span>
        </Link>
        <Link href="/vocab" className={cardClass}>
          <span className="text-foreground font-semibold">Browse Vocab</span>
          <span className="text-muted text-sm">Dictionary</span>
        </Link>
      </div>
    </div>
  );
}
