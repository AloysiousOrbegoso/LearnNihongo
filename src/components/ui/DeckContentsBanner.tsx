import Link from 'next/link';

export function DeckContextBanner({ deckId, deckName }: { deckId: string; deckName: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-accent bg-surface px-4 py-2 text-sm">
      <span className="text-foreground">
        Adding to: <span className="font-semibold">{deckName}</span>
      </span>
      <Link href={`/decks/${deckId}`} className="text-muted underline hover:text-foreground">
        Done browsing
      </Link>
    </div>
  );
}