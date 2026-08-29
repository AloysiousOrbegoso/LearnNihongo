import { readFileSync } from 'node:fs';
import { writeShards } from './shard.ts';

interface RawWord {
  id: string;
  kanji: { text: string; common: boolean }[];
  kana: { text: string; common: boolean }[];
  sense: {
    partOfSpeech: string[];
    gloss: { lang: string; text: string }[];
  }[];
}

export interface JmdictEntry {
  kanji: string[];
  kana: string[];
  senses: { partOfSpeech: string[]; glosses: string[] }[];
}

export function buildJmdict(rawPath: string, outDir: string) {
  const raw = JSON.parse(readFileSync(rawPath, 'utf-8')) as {
    version: string;
    words: RawWord[];
  };

  const entries = raw.words.map((word) => {
    const data: JmdictEntry = {
      kanji: word.kanji.map((k) => k.text),
      kana: word.kana.map((k) => k.text),
      senses: word.sense.map((s) => ({
        partOfSpeech: s.partOfSpeech,
        glosses: s.gloss.filter((g) => g.lang === 'eng').map((g) => g.text),
      })),
    };
    return { id: word.id, data };
  });

  const count = writeShards(outDir, entries, raw.version);
  return { count, version: raw.version };
}
