'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useDeckContext } from '@/hooks/useDeckContext';

function Banner() {
  const deck = useDeckContext();
  if (!deck) return null;

  return (
    <div className="border-accent/40 bg-accent/10 flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm">
      <span className="text-foreground">
        Adding to: <span className="font-semibold">{deck.name}</span>
      </span>
      <Link href={`/decks/${deck.id}`} className="text-muted hover:text-foreground underline">
        Done browsing
      </Link>
    </div>
  );
}

export function DeckContextBanner() {
  return (
    <Suspense fallback={null}>
      <Banner />
    </Suspense>
  );
}
