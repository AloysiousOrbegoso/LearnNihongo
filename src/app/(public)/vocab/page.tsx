import type { Metadata } from 'next';
import { SearchBox } from '@/components/features/SearchBox';
import { DeckContextBanner } from '@/components/ui/DeckContextBanner';

export const metadata: Metadata = {
  title: 'Vocabulary',
};

export default function VocabPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-3xl font-extrabold">Vocabulary</h1>
      <DeckContextBanner />
      <p className="text-muted">Search by kanji, kana, or English — e.g. 犬, いぬ, or dog.</p>
      <SearchBox kind="vocab" endpoint="/api/search/vocab" placeholder="Search vocabulary…" />
    </div>
  );
}
