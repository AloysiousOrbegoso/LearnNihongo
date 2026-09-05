'use client';

import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';

export function RemoveCardButton({ deckId, cardId }: { deckId: string; cardId: string }) {
  const router = useRouter();
  const { execute, loading } = useApiAction<undefined, { removed: true }>(
    `/api/decks/${deckId}/cards/${cardId}`,
    'DELETE',
  );

  async function handleClick() {
    const result = await execute();
    if (result) router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label="Remove card"
      className="text-muted hover:text-accent text-sm disabled:opacity-50"
    >
      {loading ? '…' : 'Remove'}
    </button>
  );
}
