'use client';

import { useState } from 'react';
import Link from 'next/link';

export function WriteSentencePrompt({
  word,
  gloss,
  sentenceBuilderUnlocked,
}: {
  word: string;
  gloss: string;
  sentenceBuilderUnlocked: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-border text-foreground rounded-md border px-3 py-1.5 text-sm"
      >
        Write a sentence with it
      </button>
    );
  }

  return (
    <div className="border-border bg-surface flex flex-col gap-3 rounded-md border p-4">
      <p className="text-muted text-sm">
        Try writing your own sentence using <span className="font-jp text-foreground">{word}</span>{' '}
        ({gloss}). This isn&apos;t graded — it&apos;s just a space to practice.
      </p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        placeholder="日本語で書いてみましょう…"
        className="font-jp border-border bg-background text-foreground rounded-md border px-3 py-2"
      />
      {sentenceBuilderUnlocked ? (
        <Link href="/sentences" className="text-accent self-start text-sm underline">
          Need a refresher on sentence structure? Go to Sentence Builder
        </Link>
      ) : (
        <p className="text-muted text-xs">
          Once you&apos;ve mastered kana,{' '}
          <Link href="/kana" className="underline">
            Sentence Builder
          </Link>{' '}
          will teach you how to connect clauses like this.
        </p>
      )}
    </div>
  );
}
