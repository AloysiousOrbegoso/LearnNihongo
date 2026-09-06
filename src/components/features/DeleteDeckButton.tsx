'use client';

import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';
import { Button } from '@/components/ui/Button';

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
      <Button type="button" variant="ghost" size="sm" onClick={handleClick} disabled={loading}>
        {loading ? 'Deleting…' : 'Delete deck'}
      </Button>
      {error && <span className="text-accent text-sm">{error}</span>}
    </div>
  );
}
