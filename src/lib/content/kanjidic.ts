import { createReader } from './reader';

export interface KanjidicEntry {
  grade: number | null;
  strokeCount: number;
  frequency: number | null;
  jlptLevel: number | null;
  onReadings: string[];
  kunReadings: string[];
  meanings: string[];
}

export const kanjidicReader = createReader<KanjidicEntry>('kanjidic');
