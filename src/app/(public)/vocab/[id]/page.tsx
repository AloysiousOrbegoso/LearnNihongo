import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { jmdictReader } from '@/lib/content/jmdict';
import { AddToDeckButton } from '@/components/features/AddToDeckButton';
import { DeckContextBanner } from '@/components/ui/DeckContextBanner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

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
      <Card className="flex flex-col gap-2">
        <h1 className="font-jp text-foreground text-4xl font-bold">{headword}</h1>
        {entry.kanji.length > 0 && <p className="font-jp text-muted text-lg">{reading}</p>}
      </Card>
      <ol className="flex flex-col gap-3">
        {entry.senses.map((sense, i) => (
          <li key={i} className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {sense.partOfSpeech.map((pos) => (
                <Badge key={pos} tone="accent-2">
                  {pos}
                </Badge>
              ))}
            </div>
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
