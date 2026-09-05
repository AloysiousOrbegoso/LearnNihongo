import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getVerifiedUser } from '@/lib/auth/session';
import { getDeck } from '@/lib/db/queries/decks';
import { getDeckCards } from '@/lib/db/queries/cards';
import { formatInterval } from '@/lib/review/scheduler';
import { isUuid } from '@/lib/uuid';
import { DeleteDeckButton } from '@/components/features/DeleteDeckButton';
import { RemoveCardButton } from '@/components/features/RemoveCardButton';

const STATE_LABELS: Record<number, string> = {
  0: 'New',
  1: 'Learning',
  2: 'Review',
  3: 'Relearning',
};

export default async function DeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const { id } = await params;
  if (!isUuid(id)) notFound();

  const deck = await getDeck({ deckId: id, userId: user.id });
  if (!deck) notFound();

  const now = new Date();
  const cards = (await getDeckCards({ deckId: id, userId: user.id })) ?? [];
  const dueCount = cards.filter((card) => card.due <= now).length;
  const deckQuery = `?deckId=${encodeURIComponent(deck.id)}&deckName=${encodeURIComponent(deck.name)}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-foreground text-2xl font-semibold">{deck.name}</h1>
        <span className="text-muted text-sm">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} · {dueCount} due
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {dueCount > 0 && (
          <Link
            href={`/review?deckId=${deck.id}`}
            className="bg-accent text-accent-foreground rounded-md px-3 py-1.5 text-sm"
          >
            Review ({dueCount})
          </Link>
        )}
        <Link
          href={`/kanji${deckQuery}`}
          className="border-border text-foreground rounded-md border px-3 py-1.5 text-sm"
        >
          Add kanji
        </Link>
        <Link
          href={`/vocab${deckQuery}`}
          className="border-border text-foreground rounded-md border px-3 py-1.5 text-sm"
        >
          Add vocab
        </Link>
        <DeleteDeckButton deckId={deck.id} deckName={deck.name} />
      </div>
      {cards.length === 0 ? (
        <p className="text-muted">No cards yet. Use Add kanji or Add vocab to fill this deck.</p>
      ) : (
        <ul className="divide-border border-border flex flex-col divide-y rounded-md border">
          {cards.map((card) => (
            <li key={card.id} className="flex items-baseline gap-4 px-4 py-3">
              <span className="font-jp text-foreground text-lg">{card.snapshotWord}</span>
              <span className="font-jp text-muted text-sm">{card.snapshotReading}</span>
              <span className="text-muted flex-1 truncate text-sm">{card.snapshotGloss}</span>
              <span className="text-muted text-xs whitespace-nowrap">
                {STATE_LABELS[card.state] ?? 'New'} ·{' '}
                {card.due <= now
                  ? 'due now'
                  : `in ${formatInterval(card.due.getTime() - now.getTime())}`}
              </span>
              <RemoveCardButton deckId={deck.id} cardId={card.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
