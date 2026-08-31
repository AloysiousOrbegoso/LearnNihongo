import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { JmdictEntry } from '../../src/lib/content/jmdict.ts';
import type { KanjidicEntry } from '../../src/lib/content/kanjidic.ts';

function readAllEntries<T>(dir: string): Record<string, T> {
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf-8')) as {
    manifest: Record<string, string>;
  };
  const shardNames = [...new Set(Object.values(manifest.manifest))];
  const entries: Record<string, T> = {};
  for (const shardName of shardNames) {
    const shard = JSON.parse(readFileSync(join(dir, shardName), 'utf-8')) as Record<string, T>;
    Object.assign(entries, shard);
  }
  return entries;
}

export function buildSearchIndices(jmdictDir: string, kanjidicDir: string, outDir: string) {
  mkdirSync(outDir, { recursive: true });

  const jmdict = readAllEntries<JmdictEntry>(jmdictDir);
  const vocabIndex = Object.entries(jmdict).map(([id, e]) => ({
    id,
    kanji: e.kanji[0] ?? '',
    kana: e.kana[0] ?? '',
    gloss: e.senses[0]?.glosses[0] ?? '',
  }));
  writeFileSync(join(outDir, 'vocab-index.json'), JSON.stringify(vocabIndex));

  const kanjidic = readAllEntries<KanjidicEntry>(kanjidicDir);
  const kanjiIndex = Object.entries(kanjidic).map(([literal, e]) => ({
    literal,
    kun: e.kunReadings,
    on: e.onReadings,
    meanings: e.meanings,
  }));
  writeFileSync(join(outDir, 'kanji-index.json'), JSON.stringify(kanjiIndex));

  return { vocabCount: vocabIndex.length, kanjiCount: kanjiIndex.length };
}
