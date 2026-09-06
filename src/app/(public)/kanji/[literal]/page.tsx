import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { kanjidicReader } from '@/lib/content/kanjidic';
import { kanjivgReader } from '@/lib/content/kanjivg';
import { StrokeOrder } from '@/components/features/StrokeOrder';
import { AddToDeckButton } from '@/components/features/AddToDeckButton';
import { DeckContextBanner } from '@/components/ui/DeckContextBanner';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const dynamicParams = false;

export function generateStaticParams() {
  return kanjidicReader.getAllIds().map((literal) => ({ literal }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ literal: string }>;
}): Promise<Metadata> {
  const { literal } = await params;
  return { title: decodeURIComponent(literal) };
}

export default async function KanjiDetailPage({
  params,
}: {
  params: Promise<{ literal: string }>;
}) {
  const { literal: rawLiteral } = await params;
  const literal = decodeURIComponent(rawLiteral);
  const entry = kanjidicReader.getEntry(literal);
  if (!entry) notFound();
  const strokeData = kanjivgReader.getEntry(literal);

  return (
    <div className="flex flex-col gap-6">
      <DeckContextBanner />
      <Card className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="bg-surface-sunken flex h-32 w-32 shrink-0 items-center justify-center rounded-xl">
          <h1 className="font-jp text-foreground text-7xl">{literal}</h1>
        </div>
        {strokeData && <StrokeOrder strokes={strokeData.strokes} />}
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{entry.strokeCount} strokes</Badge>
          {entry.grade !== null && <Badge tone="gold">Grade {entry.grade}</Badge>}
        </div>
      </Card>
      <dl className="flex flex-col gap-3 text-sm">
        <div>
          <dt className="text-muted">Meanings</dt>
          <dd className="text-foreground">{entry.meanings.join(', ')}</dd>
        </div>
        {entry.onReadings.length > 0 && (
          <div>
            <dt className="text-muted">On readings</dt>
            <dd className="font-jp text-foreground">{entry.onReadings.join('、')}</dd>
          </div>
        )}
        {entry.kunReadings.length > 0 && (
          <div>
            <dt className="text-muted">Kun readings</dt>
            <dd className="font-jp text-foreground">{entry.kunReadings.join('、')}</dd>
          </div>
        )}
      </dl>
      <AddToDeckButton
        contentSource="kanjidic"
        contentId={literal}
        contentVersion={kanjidicReader.getContentVersion()}
        snapshotWord={literal}
        snapshotReading={entry.onReadings[0] ?? entry.kunReadings[0] ?? literal}
        snapshotGloss={entry.meanings[0] ?? literal}
      />
    </div>
  );
}
