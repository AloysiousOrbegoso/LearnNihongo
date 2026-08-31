import type { Metadata } from 'next';
import { SearchBox } from '@/components/features/SearchBox';

export const metadata: Metadata = {
  title: 'Vocabulary',
};

export default function VocabPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-2xl font-semibold">Vocabulary</h1>
      <p className="text-muted">Search by kanji, kana, or English — e.g. 犬, いぬ, or dog.</p>
      <SearchBox kind="vocab" endpoint="/api/search/vocab" placeholder="Search vocabulary…" />
    </div>
  );
}
