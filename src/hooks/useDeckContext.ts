'use client';

import { useSearchParams } from 'next/navigation';

export interface DeckContext {
  id: string;
  name: string;
}

export function buildDeckQuery(deck: DeckContext | null): string {
  if (!deck) return '';
  return `?deckId=${encodeURIComponent(deck.id)}&deckName=${encodeURIComponent(deck.name)}`;
}

export function useDeckContext(): DeckContext | null {
  const params = useSearchParams();
  const id = params.get('deckId');
  const name = params.get('deckName');
  return id && name ? { id, name } : null;
}
