import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { jmdictReader } from '@/lib/content/jmdict';
import { AddToDeckButton } from '@/components/features/AddToDeckButton';
import { DeckContextBanner } from '@/components/ui/DeckContextBanner';

export const dynamicParams = false;

export function generateStaticParams() {
  return jmdictReader.getAllIds().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = jmdictReader.getEntry(id);
  const headword = entry?.kanji[0] ?? entry?.kana[0] ?? id;
  return { title: headword };
}

export default async function VocabDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = jmdictReader.getEntry(id);
  if (!entry) notFound();

  const headword = entry.kanji[0] ?? entry.kana[0] ?? id;
  const reading = entry.kana[0] ?? headword;
  const gloss = entry.senses[0]?.glosses[0] ?? headword;

  return (
    <div className="flex flex-col gap-6">
      <DeckContextBanner />
      <div>
        <h1 className="font-jp text-foreground text-4xl">{headword}</h1>
        {entry.kanji.length > 0 && <p className="font-jp text-muted text-lg">{reading}</p>}
      </div>
      <ol className="flex flex-col gap-3">
        {entry.senses.map((sense, i) => (
          <li key={i} className="flex flex-col gap-1">
            <span className="text-muted text-xs tracking-wide uppercase">
              {sense.partOfSpeech.join(', ')}
            </span>
            <span className="text-foreground">{sense.glosses.join('; ')}</span>
          </li>
        ))}
      </ol>
      <AddToDeckButton
        contentSource="jmdict"
        contentId={id}
        contentVersion={jmdictReader.getContentVersion()}
        snapshotWord={headword}
        snapshotReading={reading}
        snapshotGloss={gloss}
      />
    </div>
  );
}
