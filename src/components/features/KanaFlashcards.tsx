'use client';

import { useMemo, useState } from 'react';
import { getKanaSet, type KanaScript } from '@/lib/content/kana';

function shuffledIndexes(length: number) {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

export function KanaFlashcards({ initialScript }: { initialScript: KanaScript }) {
  const [script, setScript] = useState<KanaScript>(initialScript);
  const set = useMemo(() => getKanaSet(script), [script]);
  const [order, setOrder] = useState(() => shuffledIndexes(set.length));
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);

  function switchScript(next: KanaScript) {
    setScript(next);
    setOrder(shuffledIndexes(getKanaSet(next).length));
    setPosition(0);
    setRevealed(false);
  }

  function next() {
    setPosition((p) => (p + 1) % order.length);
    setRevealed(false);
  }

  function reshuffle() {
    setOrder(shuffledIndexes(set.length));
    setPosition(0);
    setRevealed(false);
  }

  const current = set[order[position]];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 text-sm">
        <button
          type="button"
          onClick={() => switchScript('hiragana')}
          className={script === 'hiragana' ? 'text-foreground font-semibold' : 'text-muted'}
        >
          Hiragana
        </button>
        <button
          type="button"
          onClick={() => switchScript('katakana')}
          className={script === 'katakana' ? 'text-foreground font-semibold' : 'text-muted'}
        >
          Katakana
        </button>
      </div>
      <div className="border-border bg-surface flex flex-col items-center gap-6 rounded-lg border px-6 py-16 text-center">
        <span className="text-muted text-xs">
          {position + 1} / {order.length}
        </span>
        <p className="font-jp text-foreground text-7xl">{current.character}</p>
        {revealed ? (
          <p className="text-foreground text-2xl">{current.romaji}</p>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="bg-accent text-accent-foreground rounded-md px-4 py-2"
          >
            Show romaji
          </button>
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={next}
          className="bg-accent text-accent-foreground rounded-md px-4 py-2"
        >
          Next
        </button>
        <button
          type="button"
          onClick={reshuffle}
          className="border-border text-foreground rounded-md border px-4 py-2"
        >
          Reshuffle
        </button>
      </div>
      <p className="text-muted text-xs">
        Practice doesn&apos;t affect your mastery progress — take an exam to update it.
      </p>
    </div>
  );
}
