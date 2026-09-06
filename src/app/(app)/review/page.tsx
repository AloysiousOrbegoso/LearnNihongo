import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getVerifiedUser } from '@/lib/auth/session';
import { getDeck } from '@/lib/db/queries/decks';
import { isUuid } from '@/lib/uuid';
import { ReviewSession } from '@/components/features/ReviewSession';

export const metadata: Metadata = {
  title: 'Review',
};

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ deckId?: string }>;
}) {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const { deckId } = await searchParams;
  const deck = isUuid(deckId) ? await getDeck({ deckId, userId: user.id }) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-foreground text-3xl font-extrabold">
          Review{deck ? `: ${deck.name}` : ''}
        </h1>
        {deck ? (
          <Link href="/review" className="text-muted hover:text-foreground text-sm underline">
            Review all decks
          </Link>
        ) : (
          <Link href="/decks" className="text-muted hover:text-foreground text-sm underline">
            Pick a deck
          </Link>
        )}
      </div>
      <ReviewSession key={deck?.id ?? 'all'} deckId={deck?.id} />
    </div>
  );
}
