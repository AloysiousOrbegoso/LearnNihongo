'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ApiResponse } from '@/types/api';
import type { SentenceTier } from '@/lib/content/sentences';
import { LinkButton } from '@/components/ui/Button';

interface SlotFillQuestion {
  kind: 'slotfill';
  templateId: string;
  jp: string;
  en: string;
  choices: { id: string; headword: string; gloss: string }[];
}

interface ConnectorQuestion {
  kind: 'connector';
  id: string;
  english: string;
  choices: string[];
}

type ExamQuestion = SlotFillQuestion | ConnectorQuestion;

interface GradedItem {
  kind: 'slotfill' | 'connector';
  id?: string;
  templateId?: string;
  selectedId?: string;
  selectedHeadword?: string;
  connector?: string;
  correct: boolean;
  correctSentence?: string;
}

type AnswerPayload =
  | { kind: 'slotfill'; templateId: string; selectedId: string }
  | { kind: 'connector'; id: string; selected: string };

interface SubmitResult {
  results: GradedItem[];
  correctCount: number;
  total: number;
}

type Phase = 'loading' | 'error' | 'locked' | 'active' | 'submitting' | 'done';

export function SentenceExamSession({ tier }: { tier: SentenceTier }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);
  const [result, setResult] = useState<SubmitResult | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await fetch(`/api/sentences/exam?tier=${tier}`);
        const body: ApiResponse<{ questions: ExamQuestion[] }> = await response.json();
        if (!active) return;
        if (!body.ok) {
          setPhase(body.error.code === 'FORBIDDEN' ? 'locked' : 'error');
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
  }, [tier]);

  async function submit(finalAnswers: AnswerPayload[]) {
    setPhase('submitting');
    try {
      const response = await fetch('/api/sentences/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, answers: finalAnswers }),
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

  function advance(answer: AnswerPayload) {
    const nextAnswers = [...answers, answer];
    setAnswers(nextAnswers);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      void submit(nextAnswers);
    }
  }

  function chooseConnector(selected: string) {
    const current = questions[index] as ConnectorQuestion;
    advance({ kind: 'connector', id: current.id, selected });
  }

  function chooseSlotFill(selectedId: string) {
    const current = questions[index] as SlotFillQuestion;
    advance({ kind: 'slotfill', templateId: current.templateId, selectedId });
  }

  if (phase === 'loading' || phase === 'submitting') return <p className="text-muted">Loading…</p>;

  if (phase === 'locked') {
    return (
      <p className="text-accent">
        This tier is locked.{' '}
        <Link href="/sentences" className="underline">
          Back to Sentence Builder
        </Link>
      </p>
    );
  }

  if (phase === 'error') {
    return (
      <p className="text-accent">
        Something went wrong.{' '}
        <Link href="/sentences" className="underline">
          Back to Sentence Builder
        </Link>
      </p>
    );
  }

  if (phase === 'done' && result) {
    return (
      <div className="flex flex-col gap-6">
        <div className="card-shadow border-border bg-surface flex flex-col items-center gap-2 rounded-2xl border px-6 py-8 text-center">
          <span className="text-4xl" aria-hidden>
            {result.correctCount === result.total ? '🎉' : '✏️'}
          </span>
          <p className="text-foreground text-xl font-bold">
            Score: {result.correctCount} / {result.total}
          </p>
        </div>
        <ul className="card-shadow divide-border border-border flex flex-col divide-y overflow-hidden rounded-xl border">
          {result.results.map((r, i) => (
            <li key={i} className="flex flex-col gap-1 px-4 py-2 text-sm">
              <span
                className={
                  r.correct ? 'text-success-strong font-medium' : 'text-accent-strong font-medium'
                }
              >
                {r.correct ? 'Correct' : 'Missed'}
              </span>
              <span className="font-jp text-foreground">
                {r.kind === 'slotfill' ? r.selectedHeadword : r.correctSentence}
              </span>
            </li>
          ))}
        </ul>
        <LinkButton href="/sentences" variant="ghost" size="sm" className="self-start">
          Back to Sentence Builder
        </LinkButton>
      </div>
    );
  }

  const current = questions[index];

  return (
    <div className="flex flex-col gap-6">
      <span className="text-muted text-sm">
        Question {index + 1} / {questions.length}
      </span>
      <div className="card-shadow border-border bg-surface flex flex-col items-center gap-4 rounded-2xl border px-6 py-10 text-center">
        <p className="font-jp text-foreground text-3xl">
          {current.kind === 'slotfill' ? current.jp : current.english}
        </p>
        {current.kind === 'slotfill' && <p className="text-muted text-sm">{current.en}</p>}
      </div>

      {current.kind === 'slotfill' ? (
        <div className="grid grid-cols-2 gap-3">
          {current.choices.map((choice) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => chooseSlotFill(choice.id)}
              className="border-border bg-surface hover:border-accent/50 hover:bg-accent/5 flex flex-col rounded-xl border px-4 py-3 text-left transition-colors"
            >
              <span className="font-jp text-foreground text-lg">{choice.headword}</span>
              <span className="text-muted text-xs">{choice.gloss}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {current.choices.map((choice) => (
            <button
              key={choice}
              type="button"
              onClick={() => chooseConnector(choice)}
              className="font-jp border-border bg-surface hover:border-accent/50 hover:bg-accent/5 rounded-xl border px-4 py-3 text-left text-lg transition-colors"
            >
              {choice}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
