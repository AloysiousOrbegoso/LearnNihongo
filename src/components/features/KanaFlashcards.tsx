'use client';

import { useMemo, useState } from 'react';
import { getKanaSet, type KanaScript } from '@/lib/content/kana';
import { Button } from '@/components/ui/Button';

function shuffledIndexes(length: number) {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

const SCRIPTS: { key: KanaScript; label: string }[] = [
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
];

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
      <div className="bg-surface-sunken flex gap-1 rounded-full p-1 text-sm">
        {SCRIPTS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => switchScript(s.key)}
            className={`flex-1 rounded-full px-3 py-1.5 font-semibold transition-colors ${
              script === s.key
                ? 'bg-accent text-accent-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="card-shadow border-border bg-surface flex flex-col items-center gap-6 rounded-2xl border px-6 py-16 text-center">
        <span className="text-muted text-xs">
          {position + 1} / {order.length}
        </span>
        <p className="font-jp text-foreground text-7xl">{current.character}</p>
        {revealed ? (
          <p className="text-foreground text-2xl">{current.romaji}</p>
        ) : (
          <Button type="button" onClick={() => setRevealed(true)}>
            Show romaji
          </Button>
        )}
      </div>
      <div className="flex gap-3">
        <Button type="button" onClick={next}>
          Next
        </Button>
        <Button type="button" variant="ghost" onClick={reshuffle}>
          Reshuffle
        </Button>
      </div>
      <p className="text-muted text-xs">
        Practice doesn&apos;t affect your mastery progress — take an exam to update it.
      </p>
    </div>
  );
}
