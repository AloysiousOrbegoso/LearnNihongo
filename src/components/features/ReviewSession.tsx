'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { ApiResponse } from '@/types/api';

interface QueueCard {
  id: string;
  deckId: string;
  deckName: string;
  word: string;
  reading: string;
  gloss: string;
  state: number;
  intervals: Record<number, string>;
}

type Phase = 'loading' | 'error' | 'empty' | 'front' | 'back';

const RATINGS = [
  { value: 1, label: 'Again' },
  { value: 2, label: 'Hard' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Easy' },
];

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

export function ReviewSession({ deckId }: { deckId?: string }) {
  const [queue, setQueue] = useState<QueueCard[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [submitting, setSubmitting] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        const query = deckId ? `?deckId=${encodeURIComponent(deckId)}` : '';
        const response = await fetch(`/api/review/queue${query}`);
        const body: ApiResponse<{ cards: QueueCard[] }> = await response.json();
        if (!active) return;
        if (!body.ok) {
          setPhase('error');
          return;
        }
        setQueue(body.data.cards);
        setIndex(0);
        setPhase(body.data.cards.length === 0 ? 'empty' : 'front');
      } catch {
        if (active) setPhase('error');
      }
    }

    void run();

    return () => {
      active = false;
    };
  }, [deckId, reloadToken]);

  function reload() {
    setPhase('loading');
    setMessage(null);
    setReloadToken((token) => token + 1);
  }

  const current = queue[index];

  const answer = useCallback(
    async (rating: number) => {
      if (!current || submitting) return;
      setSubmitting(true);
      setMessage(null);
      try {
        const response = await fetch('/api/review/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: current.id, rating }),
        });
        const body: ApiResponse<{ due: string }> = await response.json();
        if (!body.ok) {
          setMessage(body.error.message);
          return;
        }
        setReviewed((count) => count + 1);
        if (index + 1 < queue.length) {
          setIndex(index + 1);
          setPhase('front');
        } else {
          setPhase('loading');
          setReloadToken((token) => token + 1);
        }
      } catch {
        setMessage('Could not save that review.');
      } finally {
        setSubmitting(false);
      }
    },
    [current, submitting, index, queue.length],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;

      if (phase === 'front' && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault();
        setPhase('back');
        return;
      }

      if (phase === 'back' && event.key >= '1' && event.key <= '4') {
        event.preventDefault();
        void answer(Number(event.key));
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, answer]);

  const showCard = current && (phase === 'front' || phase === 'back');

  return (
    <div className="flex flex-col gap-6">
      <div className="text-muted flex items-center justify-between text-sm">
        <span>{showCard ? `Card ${index + 1} of ${queue.length}` : ''}</span>
        <span>Reviewed this session: {reviewed}</span>
      </div>

      {phase === 'loading' && <p className="text-muted">Loading…</p>}

      {phase === 'error' && (
        <div className="flex items-center gap-3">
          <p className="text-accent">Could not load your review queue.</p>
          <button type="button" onClick={reload} className="text-foreground text-sm underline">
            Retry
          </button>
        </div>
      )}

      {phase === 'empty' && (
        <div className="border-border bg-surface flex flex-col items-center gap-4 rounded-lg border px-6 py-12 text-center">
          <p className="text-foreground text-lg">All caught up.</p>
          <p className="text-muted text-sm">
            {reviewed > 0
              ? 'Cards you marked Again will come back once their short interval passes.'
              : 'Nothing is due right now. Add cards to a deck or come back later.'}
          </p>
          <div className="flex gap-4 text-sm">
            <button type="button" onClick={reload} className="text-foreground underline">
              Check again
            </button>
            <Link href="/decks" className="text-foreground underline">
              Go to decks
            </Link>
          </div>
        </div>
      )}

      {showCard && (
        <div className="border-border bg-surface flex flex-col items-center gap-6 rounded-lg border px-6 py-12 text-center">
          <span className="text-muted text-xs tracking-wide uppercase">{current.deckName}</span>
          <p className="font-jp text-foreground text-6xl">{current.word}</p>
          {phase === 'back' ? (
            <div className="flex flex-col gap-2">
              {current.reading && current.reading !== current.word && (
                <p className="font-jp text-muted text-2xl">{current.reading}</p>
              )}
              <p className="text-foreground text-lg">{current.gloss}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPhase('back')}
              className="bg-accent text-accent-foreground rounded-md px-4 py-2"
            >
              Show answer
            </button>
          )}
        </div>
      )}

      {showCard && phase === 'back' && (
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map((rating) => (
            <button
              key={rating.value}
              type="button"
              disabled={submitting}
              onClick={() => answer(rating.value)}
              className="border-border bg-surface hover:bg-background flex flex-col items-center gap-1 rounded-md border px-3 py-3 disabled:opacity-50"
            >
              <span className="text-foreground font-medium">{rating.label}</span>
              <span className="text-muted text-xs">{current.intervals[rating.value]}</span>
              <kbd className="text-muted text-xs">{rating.value}</kbd>
            </button>
          ))}
        </div>
      )}

      {message && <p className="text-accent text-sm">{message}</p>}

      <p className="text-muted text-xs">Space or Enter reveals the answer · 1–4 rates the card</p>
    </div>
  );
}
