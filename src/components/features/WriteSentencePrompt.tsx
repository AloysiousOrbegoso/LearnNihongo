'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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
      <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Write a sentence with it
      </Button>
    );
  }

  return (
    <Card className="flex w-full flex-col gap-3">
      <p className="text-muted text-sm">
        Try writing your own sentence using <span className="font-jp text-foreground">{word}</span>{' '}
        ({gloss}). This isn&apos;t graded — it&apos;s just a space to practice.
      </p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={3}
        placeholder="日本語で書いてみましょう…"
        className="font-jp border-border bg-background text-foreground focus:border-accent focus:ring-accent/30 rounded-lg border px-3.5 py-2.5 outline-none focus:ring-2"
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
    </Card>
  );
}
