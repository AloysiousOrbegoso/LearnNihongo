import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getVerifiedUser } from '@/lib/auth/session';
import { getUserDecksWithCounts } from '@/lib/db/queries/decks';
import { CreateDeckForm } from '@/components/features/CreateDeckForm';

export default async function DecksPage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const decks = await getUserDecksWithCounts({ userId: user.id, now: new Date() });
  const totalDue = decks.reduce((sum, deck) => sum + deck.dueCount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-foreground text-2xl font-semibold">Decks</h1>
        {totalDue > 0 && (
          <Link
            href="/review"
            className="bg-accent text-accent-foreground rounded-md px-3 py-1.5 text-sm"
          >
            Review all ({totalDue} due)
          </Link>
        )}
      </div>
      <CreateDeckForm />
      {decks.length === 0 ? (
        <p className="text-muted">No decks yet. Create one, then add kanji or vocabulary to it.</p>
      ) : (
        <ul className="divide-border border-border flex flex-col divide-y rounded-md border">
          {decks.map((deck) => (
            <li key={deck.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <Link href={`/decks/${deck.id}`} className="text-foreground flex-1 hover:underline">
                {deck.name}
              </Link>
              <span className="text-muted text-sm">
                {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'} · {deck.dueCount} due
              </span>
              {deck.dueCount > 0 && (
                <Link href={`/review?deckId=${deck.id}`} className="text-accent text-sm underline">
                  Review
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
