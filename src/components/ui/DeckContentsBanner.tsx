import Link from 'next/link';

export function DeckContextBanner({ deckId, deckName }: { deckId: string; deckName: string }) {
  return (
    <div className="border-accent bg-surface flex items-center justify-between rounded-md border px-4 py-2 text-sm">
      <span className="text-foreground">
        Adding to: <span className="font-semibold">{deckName}</span>
      </span>
      <Link href={`/decks/${deckId}`} className="text-muted hover:text-foreground underline">
        Done browsing
      </Link>
    </div>
  );
}
