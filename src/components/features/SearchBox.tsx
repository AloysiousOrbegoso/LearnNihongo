'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ApiResponse } from '@/types/api';

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

function toVocabResult(hit: VocabHit): Result {
  return {
    href: `/vocab/${hit.id}`,
    primary: hit.kanji || hit.kana,
    secondary: hit.gloss,
  };
}

function toKanjiResult(hit: KanjiHit): Result {
  return {
    href: `/kanji/${hit.literal}`,
    primary: hit.literal,
    secondary: hit.meanings[0] ?? '',
  };
}

export function SearchBox({
  kind,
  endpoint,
  placeholder,
}: {
  kind: 'vocab' | 'kanji';
  endpoint: string;
  placeholder: string;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleChange(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const response = await fetch(`${endpoint}?q=${encodeURIComponent(value)}`);
    const body: ApiResponse<(VocabHit | KanjiHit)[]> = await response.json();
    setLoading(false);
    if (body.ok) {
      setResults(
        kind === 'vocab'
          ? (body.data as VocabHit[]).map(toVocabResult)
          : (body.data as KanjiHit[]).map(toKanjiResult),
      );
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={query}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="border-border bg-surface text-foreground rounded-md border px-4 py-2"
      />
      {loading && <p className="text-muted text-sm">Searching…</p>}
      {results.length > 0 && (
        <ul className="divide-border border-border flex flex-col divide-y rounded-md border">
          {results.map((result) => (
            <li key={result.href}>
              <Link
                href={result.href}
                className="hover:bg-surface flex items-baseline justify-between px-4 py-3"
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
