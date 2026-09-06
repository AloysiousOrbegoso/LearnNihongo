'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useDeckContext } from '@/hooks/useDeckContext';
import type { ApiResponse } from '@/types/api';
import { Button } from '@/components/ui/Button';

interface Deck {
  id: string;
  name: string;
}

interface Payload {
  contentSource: 'jmdict' | 'kanjidic';
  contentId: string;
  contentVersion: string;
  snapshotWord: string;
  snapshotReading: string;
  snapshotGloss: string;
}

type LoadState = 'loading' | 'no-decks' | 'ready' | 'error';

async function submitCard(deckId: string, payload: Payload) {
  try {
    const response = await fetch(`/api/decks/${deckId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return (await response.json()) as ApiResponse<{ duplicate?: true }>;
  } catch {
    return {
      ok: false,
      error: { code: 'NETWORK', message: 'Could not reach the server.' },
    } as ApiResponse<{ duplicate?: true }>;
  }
}

function resultMessage(body: ApiResponse<{ duplicate?: true }>) {
  if (!body.ok) return 'Could not add card.';
  return body.data.duplicate ? 'Already in that deck.' : 'Added.';
}

function FixedDeckAdd({ deck, payload }: { deck: Deck; payload: Payload }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAdd() {
    setSaving(true);
    setMessage(null);
    setMessage(resultMessage(await submitCard(deck.id, payload)));
    setSaving(false);
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" size="sm" onClick={handleAdd} disabled={saving}>
        {saving ? 'Adding…' : `Add to ${deck.name}`}
      </Button>
      {message && <span className="text-muted text-sm">{message}</span>}
    </div>
  );
}

function DeckPickerAdd({ payload }: { payload: Payload }) {
  const [state, setState] = useState<LoadState>('loading');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    fetch('/api/decks')
      .then((response) => response.json() as Promise<ApiResponse<Deck[]>>)
      .then((body) => {
        if (!active) return;
        if (!body.ok) {
          setState('error');
          return;
        }
        if (body.data.length === 0) {
          setState('no-decks');
          return;
        }
        setDecks(body.data);
        setSelectedDeckId(body.data[0].id);
        setState('ready');
      })
      .catch(() => {
        if (active) setState('error');
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleAdd() {
    setSaving(true);
    setMessage(null);
    setMessage(resultMessage(await submitCard(selectedDeckId, payload)));
    setSaving(false);
  }

  if (state === 'loading') return null;

  if (state === 'no-decks') {
    return (
      <Link href="/decks" className="text-accent text-sm underline">
        Create a deck first
      </Link>
    );
  }

  if (state === 'error') {
    return <p className="text-muted text-sm">Could not load decks.</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedDeckId}
        onChange={(event) => setSelectedDeckId(event.target.value)}
        className="border-border bg-surface text-foreground rounded-lg border px-2 py-1.5 text-sm"
      >
        {decks.map((deck) => (
          <option key={deck.id} value={deck.id}>
            {deck.name}
          </option>
        ))}
      </select>
      <Button type="button" size="sm" onClick={handleAdd} disabled={saving}>
        {saving ? 'Adding…' : 'Add to deck'}
      </Button>
      {message && <span className="text-muted text-sm">{message}</span>}
    </div>
  );
}

function AddToDeck(payload: Payload) {
  const status = useCurrentUser();
  const deck = useDeckContext();

  if (status === 'loading') return null;

  if (status === 'signed-out') {
    return (
      <Link href="/sign-in" className="text-accent text-sm underline">
        Sign in to save to a deck
      </Link>
    );
  }

  return deck ? (
    <FixedDeckAdd deck={deck} payload={payload} />
  ) : (
    <DeckPickerAdd payload={payload} />
  );
}

export function AddToDeckButton(payload: Payload) {
  return (
    <Suspense fallback={null}>
      <AddToDeck {...payload} />
    </Suspense>
  );
}
