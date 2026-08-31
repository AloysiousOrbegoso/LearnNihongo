import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface VocabIndexEntry {
  id: string;
  kanji: string;
  kana: string;
  gloss: string;
}

interface KanjiIndexEntry {
  literal: string;
  kun: string[];
  on: string[];
  meanings: string[];
}

const SEARCH_DIR = join(process.cwd(), 'content', 'search');
const MAX_RESULTS = 20;

let vocabIndex: VocabIndexEntry[] | null = null;
let kanjiIndex: KanjiIndexEntry[] | null = null;

function getVocabIndex(): VocabIndexEntry[] {
  if (!vocabIndex) {
    vocabIndex = JSON.parse(
      readFileSync(join(SEARCH_DIR, 'vocab-index.json'), 'utf-8'),
    ) as VocabIndexEntry[];
  }
  return vocabIndex;
}

function getKanjiIndex(): KanjiIndexEntry[] {
  if (!kanjiIndex) {
    kanjiIndex = JSON.parse(
      readFileSync(join(SEARCH_DIR, 'kanji-index.json'), 'utf-8'),
    ) as KanjiIndexEntry[];
  }
  return kanjiIndex;
}

export function searchVocab(query: string): VocabIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: VocabIndexEntry[] = [];
  for (const entry of getVocabIndex()) {
    if (
      entry.kanji.includes(query) ||
      entry.kana.includes(query) ||
      entry.gloss.toLowerCase().includes(q)
    ) {
      results.push(entry);
      if (results.length >= MAX_RESULTS) break;
    }
  }
  return results;
}

export function searchKanji(query: string): KanjiIndexEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: KanjiIndexEntry[] = [];
  for (const entry of getKanjiIndex()) {
    if (
      entry.literal === query ||
      entry.kun.some((r) => r.includes(query)) ||
      entry.on.some((r) => r.includes(query)) ||
      entry.meanings.some((m) => m.toLowerCase().includes(q))
    ) {
      results.push(entry);
      if (results.length >= MAX_RESULTS) break;
    }
  }
  return results;
}
