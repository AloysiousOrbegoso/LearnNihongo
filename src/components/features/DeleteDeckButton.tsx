'use client';

import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';

export function DeleteDeckButton({ deckId, deckName }: { deckId: string; deckName: string }) {
  const router = useRouter();
  const { execute, loading, error } = useApiAction<undefined, { deleted: true }>(
    `/api/decks/${deckId}`,
    'DELETE',
  );

  async function handleClick() {
    if (!window.confirm(`Delete "${deckName}" and all of its cards?`)) return;
    const result = await execute();
    if (result) {
      router.push('/decks');
      router.refresh();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="border-border text-muted hover:text-accent rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
      >
        {loading ? 'Deleting…' : 'Delete deck'}
      </button>
      {error && <span className="text-accent text-sm">{error}</span>}
    </div>
  );
}
