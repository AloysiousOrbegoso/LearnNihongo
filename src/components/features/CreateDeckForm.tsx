'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';
import type { CreateDeckInput } from '@/schemas/decks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
        <Input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New deck name"
          required
          maxLength={100}
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create'}
        </Button>
      </div>
      {error && <p className="text-accent text-sm">{error}</p>}
    </form>
  );
}
