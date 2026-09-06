'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ApiResponse } from '@/types/api';
import type { KanaScript } from '@/lib/content/kana';

interface Question {
  character: string;
  choices: string[];
}

interface GradedAnswer {
  character: string;
  selected: string;
  correct: boolean;
  correctRomaji: string;
}

interface SubmitResult {
  results: GradedAnswer[];
  correctCount: number;
  total: number;
}

type Phase = 'loading' | 'error' | 'active' | 'submitting' | 'done';

export function KanaExamSession({ script, size }: { script: KanaScript; size: number }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<{ character: string; selected: string }[]>([]);
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(`/api/kana/exam?script=${script}&size=${size}`);
        const body: ApiResponse<{ questions: Question[] }> = await response.json();
        if (!active) return;
        if (!body.ok) {
          setPhase('error');
          return;
        }
        setQuestions(body.data.questions);
        setIndex(0);
        setAnswers([]);
        setPhase('active');
      } catch {
        if (active) setPhase('error');
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [script, size]);

  async function submit(finalAnswers: { character: string; selected: string }[]) {
    setPhase('submitting');
    try {
      const response = await fetch('/api/kana/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, answers: finalAnswers }),
      });
      const body: ApiResponse<SubmitResult> = await response.json();
      if (!body.ok) {
        setPhase('error');
        return;
      }
      setResult(body.data);
      setPhase('done');
    } catch {
      setPhase('error');
    }
  }

  function choose(selected: string) {
    const current = questions[index];
    const nextAnswers = [...answers, { character: current.character, selected }];
    setAnswers(nextAnswers);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      void submit(nextAnswers);
    }
  }

  if (phase === 'loading' || phase === 'submitting') {
    return <p className="text-muted">Loading…</p>;
  }

  if (phase === 'error') {
    return (
      <p className="text-accent">
        Something went wrong.{' '}
        <Link href="/kana" className="underline">
          Back to Kana
        </Link>
      </p>
    );
  }

  if (phase === 'done' && result) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-foreground text-xl">
          Score: {result.correctCount} / {result.total}
        </p>
        <ul className="divide-border border-border flex flex-col divide-y rounded-md border">
          {result.results.map((r) => (
            <li key={r.character} className="flex items-center justify-between px-4 py-2 text-sm">
              <span className="font-jp text-foreground text-lg">{r.character}</span>
              <span className={r.correct ? 'text-foreground' : 'text-accent'}>
                {r.selected}
                {!r.correct && ` (${r.correctRomaji})`}
              </span>
            </li>
          ))}
        </ul>
        <Link href="/kana" className="text-foreground text-sm underline">
          Back to Kana
        </Link>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div className="flex flex-col gap-6">
      <span className="text-muted text-sm">
        Question {index + 1} / {questions.length}
      </span>
      <div className="border-border bg-surface flex flex-col items-center gap-6 rounded-lg border px-6 py-16 text-center">
        <p className="font-jp text-foreground text-7xl">{current.character}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {current.choices.map((choice) => (
          <button
            key={choice}
            type="button"
            onClick={() => choose(choice)}
            className="border-border bg-surface hover:bg-background rounded-md border px-4 py-3 text-lg"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}
