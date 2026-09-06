'use client';

import { useState } from 'react';
import {
  CONNECTOR_EXERCISES,
  getConnectorsForTier,
  type SentenceTier,
} from '@/lib/content/sentences';

function shuffledIndexes(length: number) {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
}

interface SimpleExample {
  jp: string;
  en: string;
}

function SimplePractice({ examples }: { examples: SimpleExample[] }) {
  const [order] = useState(() => shuffledIndexes(examples.length));
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = examples[order[position]];

  function next() {
    setPosition((p) => (p + 1) % order.length);
    setRevealed(false);
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-foreground text-lg font-semibold">Practice</h2>
      <p className="text-muted text-sm">
        Each example draws a fresh real word from the dictionary — click Next for a new one.
      </p>
      <div className="border-border bg-surface flex flex-col items-center gap-6 rounded-lg border px-6 py-12 text-center">
        <span className="text-muted text-xs">
          {position + 1} / {order.length}
        </span>
        <p className="text-foreground text-lg">{current.en}</p>
        {revealed ? (
          <p className="font-jp text-foreground text-2xl">{current.jp}</p>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="bg-accent text-accent-foreground rounded-md px-4 py-2"
          >
            Show answer
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={next}
        className="bg-accent text-accent-foreground self-start rounded-md px-4 py-2"
      >
        Next
      </button>
      <p className="text-muted text-xs">
        Practice doesn&apos;t affect your mastery progress — take an exam to update it.
      </p>
    </section>
  );
}

function ConnectorPractice({ tier }: { tier: 'compound' | 'complex' }) {
  const items = CONNECTOR_EXERCISES.filter((e) => e.tier === tier);
  const [order] = useState(() => shuffledIndexes(items.length));
  const [position, setPosition] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const current = items[order[position]];

  function next() {
    setPosition((p) => (p + 1) % order.length);
    setRevealed(false);
  }

  return (
    <>
      <section className="flex flex-col gap-4">
        <h2 className="text-foreground text-lg font-semibold">Connectors in this tier</h2>
        {getConnectorsForTier(tier).map((lesson) => (
          <div
            key={lesson.id}
            className="border-border bg-surface flex flex-col gap-1 rounded-md border p-4"
          >
            <span className="font-jp text-foreground text-xl">{lesson.label}</span>
            <p className="text-muted text-sm">{lesson.explanation}</p>
            <p className="font-jp text-foreground">{lesson.example}</p>
            <p className="text-muted text-xs">{lesson.exampleEnglish}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-foreground text-lg font-semibold">Practice</h2>
        <div className="border-border bg-surface flex flex-col items-center gap-6 rounded-lg border px-6 py-12 text-center">
          <span className="text-muted text-xs">
            {position + 1} / {order.length}
          </span>
          <p className="text-foreground text-lg">{current.english}</p>
          {revealed ? (
            <p className="font-jp text-foreground text-2xl">{current.correct}</p>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="bg-accent text-accent-foreground rounded-md px-4 py-2"
            >
              Show answer
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={next}
          className="bg-accent text-accent-foreground self-start rounded-md px-4 py-2"
        >
          Next
        </button>
        <p className="text-muted text-xs">
          Practice doesn&apos;t affect your mastery progress — take an exam to update it.
        </p>
      </section>
    </>
  );
}

export function SentencePractice({
  tier,
  simpleExamples,
}: {
  tier: SentenceTier;
  simpleExamples?: SimpleExample[];
}) {
  if (tier === 'simple') {
    return (
      <div className="flex flex-col gap-8">
        <SimplePractice examples={simpleExamples ?? []} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <ConnectorPractice tier={tier} />
    </div>
  );
}
