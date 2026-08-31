import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { jmdictReader } from '@/lib/content/jmdict';

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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-jp text-foreground text-4xl">{entry.kanji[0] ?? entry.kana[0]}</h1>
        {entry.kanji.length > 0 && <p className="font-jp text-muted text-lg">{entry.kana[0]}</p>}
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
    </div>
  );
}
