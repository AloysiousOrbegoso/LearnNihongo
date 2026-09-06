import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { jmdictReader } from '@/lib/content/jmdict';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { wordOfDayIndex } from '@/lib/trivia/wordOfDay';
import { AddToDeckButton } from '@/components/features/AddToDeckButton';
import { WriteSentencePrompt } from '@/components/features/WriteSentencePrompt';

export const metadata: Metadata = {
  title: 'Daily Trivia',
};

export default async function TriviaPage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const day = new Date().toISOString().slice(0, 10);
  const ids = jmdictReader.getAllIds();
  const id = ids[wordOfDayIndex(day, ids.length)];
  const entry = jmdictReader.getEntry(id)!;

  const headword = entry.kanji[0] ?? entry.kana[0] ?? id;
  const reading = entry.kana[0] ?? headword;
  const gloss = entry.senses[0]?.glosses[0] ?? headword;

  const kana = await getMasterySummary(user.id);
  const sentenceBuilderUnlocked =
    kana.hiragana.mastered === kana.hiragana.total &&
    kana.katakana.mastered === kana.katakana.total;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-3xl font-extrabold">Daily Trivia</h1>
      <p className="text-muted text-sm">{day}</p>
      <div className="card-shadow border-border bg-surface flex flex-col items-center gap-4 rounded-2xl border px-6 py-12 text-center">
        <span className="text-3xl" aria-hidden>
          🎴
        </span>
        <h2 className="font-jp text-foreground text-5xl">{headword}</h2>
        {entry.kanji.length > 0 && <p className="font-jp text-muted text-xl">{reading}</p>}
        <p className="text-foreground text-lg">{gloss}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <AddToDeckButton
          contentSource="jmdict"
          contentId={id}
          contentVersion={jmdictReader.getContentVersion()}
          snapshotWord={headword}
          snapshotReading={reading}
          snapshotGloss={gloss}
        />
        <WriteSentencePrompt
          word={headword}
          gloss={gloss}
          sentenceBuilderUnlocked={sentenceBuilderUnlocked}
        />
      </div>
    </div>
  );
}
