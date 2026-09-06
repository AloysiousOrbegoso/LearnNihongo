import type { Metadata } from 'next';
import { SearchBox } from '@/components/features/SearchBox';
import { DeckContextBanner } from '@/components/ui/DeckContextBanner';

export const metadata: Metadata = {
  title: 'Kanji',
};

export default function KanjiPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-3xl font-extrabold">Kanji</h1>
      <DeckContextBanner />
      <p className="text-muted">
        Search by kanji, reading, or English meaning — e.g. 水, みず, or water.
      </p>
      <SearchBox kind="kanji" endpoint="/api/search/kanji" placeholder="Search kanji…" />
    </div>
  );
}
