import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getVerifiedUser } from '@/lib/auth/session';
import { getUserDecksWithCounts } from '@/lib/db/queries/decks';
import { CreateDeckForm } from '@/components/features/CreateDeckForm';
import { NewDeckDisclosure } from '@/components/features/NewDeckDisclosure';
import { LinkButton } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default async function DecksPage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const decks = await getUserDecksWithCounts({ userId: user.id, now: new Date() });
  const totalDue = decks.reduce((sum, deck) => sum + deck.dueCount, 0);
  const totalCards = decks.reduce((sum, deck) => sum + deck.cardCount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-2 mb-1">Decks</h1>
          <p className="text-muted text-sm">
            {decks.length} deck{decks.length === 1 ? '' : 's'} · {totalCards} cards
            {totalDue > 0 && ` · ${totalDue} due`}
          </p>
        </div>
        <NewDeckDisclosure>
          <CreateDeckForm />
        </NewDeckDisclosure>
      </div>

      {decks.length === 0 ? (
        <p className="text-muted border-border rounded-lg border border-dashed px-5 py-10 text-center text-sm">
          No decks yet. Create one, then add kanji or vocabulary to it.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {decks.map((deck) => (
            <li
              key={deck.id}
              className="border-border bg-surface flex items-center gap-4 rounded-lg border p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Link href={`/decks/${deck.id}`} className="text-foreground truncate font-medium">
                    {deck.name}
                  </Link>
                  {deck.dueCount > 0 && <Badge tone="accent">{deck.dueCount} due</Badge>}
                </div>
                <span className="text-subtle text-xs">
                  {deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}
                </span>
              </div>
              {deck.dueCount > 0 ? (
                <LinkButton href={`/review?deckId=${deck.id}`} size="sm" className="flex-shrink-0">
                  Review
                </LinkButton>
              ) : (
                <LinkButton
                  href={`/decks/${deck.id}`}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0"
                >
                  Open
                </LinkButton>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
