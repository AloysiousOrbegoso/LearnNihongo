import { notFound, redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getDeck } from '@/lib/db/queries/decks';
import { getDeckCards } from '@/lib/db/queries/cards';
import { formatInterval } from '@/lib/review/scheduler';
import { isUuid } from '@/lib/uuid';
import { DeleteDeckButton } from '@/components/features/DeleteDeckButton';
import { RemoveCardButton } from '@/components/features/RemoveCardButton';
import { LinkButton } from '@/components/ui/Button';

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
        <h1 className="text-foreground text-3xl font-extrabold">{deck.name}</h1>
        <span className="text-muted text-sm">
          {cards.length} {cards.length === 1 ? 'card' : 'cards'} · {dueCount} due
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {dueCount > 0 && (
          <LinkButton href={`/review?deckId=${deck.id}`} size="sm">
            Review ({dueCount})
          </LinkButton>
        )}
        <LinkButton href={`/kanji${deckQuery}`} variant="ghost" size="sm">
          Add kanji
        </LinkButton>
        <LinkButton href={`/vocab${deckQuery}`} variant="ghost" size="sm">
          Add vocab
        </LinkButton>
        <DeleteDeckButton deckId={deck.id} deckName={deck.name} />
      </div>
      {cards.length === 0 ? (
        <p className="text-muted">No cards yet. Use Add kanji or Add vocab to fill this deck.</p>
      ) : (
        <ul className="card-shadow divide-border border-border flex flex-col divide-y overflow-hidden rounded-xl border">
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
