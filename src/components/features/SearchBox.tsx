'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { buildDeckQuery, useDeckContext } from '@/hooks/useDeckContext';
import type { ApiResponse } from '@/types/api';
import { Input } from '@/components/ui/Input';

interface Result {
  href: string;
  primary: string;
  secondary: string;
}

interface VocabHit {
  id: string;
  kanji: string;
  kana: string;
  gloss: string;
}

interface KanjiHit {
  literal: string;
  kun: string[];
  on: string[];
  meanings: string[];
}

const DEBOUNCE_MS = 200;

function toResults(kind: 'vocab' | 'kanji', hits: (VocabHit | KanjiHit)[], deckQuery: string) {
  return kind === 'vocab'
    ? (hits as VocabHit[]).map((hit) => ({
        href: `/vocab/${hit.id}${deckQuery}`,
        primary: hit.kanji || hit.kana,
        secondary: hit.gloss,
      }))
    : (hits as KanjiHit[]).map((hit) => ({
        href: `/kanji/${hit.literal}${deckQuery}`,
        primary: hit.literal,
        secondary: hit.meanings[0] ?? '',
      }));
}

function Search({
  kind,
  endpoint,
  placeholder,
}: {
  kind: 'vocab' | 'kanji';
  endpoint: string;
  placeholder: string;
}) {
  const deck = useDeckContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const deckQuery = buildDeckQuery(deck);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`${endpoint}?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const body: ApiResponse<(VocabHit | KanjiHit)[]> = await response.json();
        if (body.ok) setResults(toResults(kind, body.data, deckQuery));
      } catch {
        if (!controller.signal.aborted) setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, endpoint, kind, deckQuery]);

  function handleChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="search"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {loading && <p className="text-muted text-sm">Searching…</p>}
      {results.length > 0 && (
        <ul className="card-shadow divide-border border-border flex flex-col divide-y overflow-hidden rounded-xl border">
          {results.map((result) => (
            <li key={result.href}>
              <Link
                href={result.href}
                className="hover:bg-surface-sunken flex items-baseline justify-between px-4 py-3"
              >
                <span className="font-jp text-foreground text-lg">{result.primary}</span>
                <span className="text-muted text-sm">{result.secondary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SearchBox(props: {
  kind: 'vocab' | 'kanji';
  endpoint: string;
  placeholder: string;
}) {
  return (
    <Suspense fallback={null}>
      <Search {...props} />
    </Suspense>
  );
}
