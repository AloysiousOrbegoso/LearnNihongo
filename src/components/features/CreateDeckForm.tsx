'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';
import type { CreateDeckInput } from '@/schemas/decks';

export function CreateDeckForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const { execute, loading, error } = useApiAction<CreateDeckInput, { id: string }>('/api/decks');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await execute({ name });
    if (result) {
      setName('');
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New deck name"
          required
          maxLength={100}
          className="border-border bg-surface text-foreground flex-1 rounded-md border px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-accent-foreground rounded-md px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create'}
        </button>
      </div>
      {error && <p className="text-accent text-sm">{error}</p>}
    </form>
  );
}
