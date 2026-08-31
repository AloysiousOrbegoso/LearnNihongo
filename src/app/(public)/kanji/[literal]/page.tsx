import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { kanjidicReader } from '@/lib/content/kanjidic';
import { kanjivgReader } from '@/lib/content/kanjivg';
import { StrokeOrder } from '@/components/features/StrokeOrder';

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
  return { title: literal };
}

export default async function KanjiDetailPage({
  params,
}: {
  params: Promise<{ literal: string }>;
}) {
  const { literal } = await params;
  const entry = kanjidicReader.getEntry(literal);
  if (!entry) notFound();
  const strokeData = kanjivgReader.getEntry(literal);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6">
        <h1 className="font-jp text-foreground text-6xl">{literal}</h1>
        {strokeData && <StrokeOrder strokes={strokeData.strokes} />}
      </div>
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
        <div>
          <dt className="text-muted">Stroke count</dt>
          <dd className="text-foreground">{entry.strokeCount}</dd>
        </div>
        {entry.grade !== null && (
          <div>
            <dt className="text-muted">Grade</dt>
            <dd className="text-foreground">{entry.grade}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
