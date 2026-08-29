import { readFileSync } from 'node:fs';
import { writeShards } from './shard.ts';

interface RawCharacter {
  literal: string;
  misc: {
    grade: number | null;
    strokeCounts: number[];
    frequency: number | null;
    jlptLevel: number | null;
  };
  readingMeaning: {
    groups: {
      readings: { type: string; value: string }[];
      meanings: { lang: string; value: string }[];
    }[];
  } | null;
}

export interface KanjidicEntry {
  grade: number | null;
  strokeCount: number;
  frequency: number | null;
  jlptLevel: number | null;
  onReadings: string[];
  kunReadings: string[];
  meanings: string[];
}

const JOUYOU_MAX_GRADE = 8;

export function buildKanjidic(rawPath: string, outDir: string) {
  const raw = JSON.parse(readFileSync(rawPath, 'utf-8')) as {
    version: string;
    characters: RawCharacter[];
  };

  const jouyou = raw.characters.filter(
    (c) => c.misc.grade !== null && c.misc.grade <= JOUYOU_MAX_GRADE,
  );

  const entries = jouyou.map((c) => {
    const group = c.readingMeaning?.groups[0];
    const data: KanjidicEntry = {
      grade: c.misc.grade,
      strokeCount: c.misc.strokeCounts[0],
      frequency: c.misc.frequency,
      jlptLevel: c.misc.jlptLevel,
      onReadings: group?.readings.filter((r) => r.type === 'ja_on').map((r) => r.value) ?? [],
      kunReadings: group?.readings.filter((r) => r.type === 'ja_kun').map((r) => r.value) ?? [],
      meanings: group?.meanings.filter((m) => m.lang === 'en').map((m) => m.value) ?? [],
    };
    return { id: c.literal, data };
  });

  const count = writeShards(outDir, entries, raw.version);
  return { count, version: raw.version, literals: new Set(jouyou.map((c) => c.literal)) };
}
