import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { writeShards } from './shard.ts';

interface JmdictEntry {
  kanji: string[];
  kana: string[];
  senses: { partOfSpeech: string[]; glosses: string[] }[];
}

interface JmdictManifest {
  contentVersion: string;
  manifest: Record<string, string>;
}

function loadJmdict(jmdictDir: string) {
  const manifest = JSON.parse(
    readFileSync(join(jmdictDir, 'manifest.json'), 'utf-8'),
  ) as JmdictManifest;
  const shardCache = new Map<string, Record<string, JmdictEntry>>();

  function getShard(shardName: string): Record<string, JmdictEntry> {
    let shard = shardCache.get(shardName);
    if (!shard) {
      shard = JSON.parse(readFileSync(join(jmdictDir, shardName), 'utf-8')) as Record<
        string,
        JmdictEntry
      >;
      shardCache.set(shardName, shard);
    }
    return shard;
  }

  return {
    getAllIds: (): string[] => Object.keys(manifest.manifest),
    getEntry: (id: string): JmdictEntry | null => {
      const shardName = manifest.manifest[id];
      if (!shardName) return null;
      return getShard(shardName)[id] ?? null;
    },
    getContentVersion: (): string => manifest.contentVersion,
  };
}

export interface TatoebaExample {
  jp: string;
  en: string;
}

export interface ParsedWord {
  headword: string;
  reading?: string;
  jmdictId?: string;
  checked: boolean;
}

const WORD_PATTERN = /^([^()[\]{}]+)(?:\((.+)\))?(?:\[(.+)\])?(?:\{(.+)\})?(~)?$/;

export function parseWord(token: string): ParsedWord | null {
  const match = WORD_PATTERN.exec(token);
  if (!match) return null;
  const [, headword, reading, , , checked] = match;
  const result: ParsedWord = { headword, checked: checked === '~' };
  if (reading) {
    if (reading.startsWith('#')) result.jmdictId = reading.slice(1);
    else result.reading = reading;
  }
  return result;
}

export function parseIndexText(text: string): ParsedWord[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map(parseWord)
    .filter((w): w is ParsedWord => w !== null);
}

function readSentences(path: string): Map<string, string> {
  const map = new Map<string, string>();
  const content = readFileSync(path, 'utf-8');
  for (const rawLine of content.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (!line) continue;
    const [id, , text] = line.split('\t');
    if (id && text !== undefined) map.set(id, text);
  }
  return map;
}

interface IndexRow {
  sentenceId: string;
  translationId: string;
  text: string;
}

function readIndices(path: string): IndexRow[] {
  const content = readFileSync(path, 'utf-8');
  const rows: IndexRow[] = [];
  for (const rawLine of content.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    if (!line) continue;
    const [sentenceId, translationId, text] = line.split('\t');
    if (sentenceId && translationId && text !== undefined) {
      rows.push({ sentenceId, translationId, text });
    }
  }
  return rows;
}

function buildHeadwordIndex(
  jmdict: ReturnType<typeof loadJmdict>,
  ids: readonly string[],
): Map<string, string[]> {
  const index = new Map<string, string[]>();
  for (const id of ids) {
    const entry = jmdict.getEntry(id);
    if (!entry) continue;
    for (const head of [...entry.kanji, ...entry.kana]) {
      const list = index.get(head);
      if (list) list.push(id);
      else index.set(head, [id]);
    }
  }
  return index;
}

function resolveEntryId(
  jmdict: ReturnType<typeof loadJmdict>,
  word: ParsedWord,
  headwordIndex: Map<string, string[]>,
  validIds: Set<string>,
): string | null {
  if (word.jmdictId && validIds.has(word.jmdictId)) return word.jmdictId;

  const candidates = headwordIndex.get(word.headword);
  if (!candidates || candidates.length === 0) return null;
  if (word.reading) {
    const reading = word.reading;
    const withReading = candidates.find((id) => jmdict.getEntry(id)?.kana.includes(reading));
    if (withReading) return withReading;
  }
  return candidates[0];
}

const MAX_EXAMPLES_PER_ENTRY = 3;

export function buildTatoeba(
  jmdictDir: string,
  jpnSentencesPath: string,
  engSentencesPath: string,
  indicesPath: string,
  outDir: string,
) {
  const jmdict = loadJmdict(jmdictDir);
  const jpnSentences = readSentences(jpnSentencesPath);
  const engSentences = readSentences(engSentencesPath);
  const indices = readIndices(indicesPath);
  const ids = jmdict.getAllIds();
  const headwordIndex = buildHeadwordIndex(jmdict, ids);
  const validIds = new Set(ids);

  const candidates = new Map<string, (TatoebaExample & { checked: boolean })[]>();

  for (const row of indices) {
    const jp = jpnSentences.get(row.sentenceId);
    const en = engSentences.get(row.translationId);
    if (!jp || !en) continue;

    const words = parseIndexText(row.text);
    const seenIds = new Set<string>();
    for (const word of words) {
      const id = resolveEntryId(jmdict, word, headwordIndex, validIds);
      if (!id || seenIds.has(id)) continue;
      seenIds.add(id);

      const list = candidates.get(id) ?? [];
      list.push({ jp, en, checked: word.checked });
      candidates.set(id, list);
    }
  }

  const entries = Array.from(candidates.entries()).map(([id, list]) => {
    const sorted = [...list].sort((a, b) => {
      if (a.checked !== b.checked) return a.checked ? -1 : 1;
      return a.jp.length - b.jp.length;
    });
    const data: TatoebaExample[] = sorted
      .slice(0, MAX_EXAMPLES_PER_ENTRY)
      .map(({ jp, en }) => ({ jp, en }));
    return { id, data };
  });

  const count = writeShards(outDir, entries, jmdict.getContentVersion());
  return { count };
}
