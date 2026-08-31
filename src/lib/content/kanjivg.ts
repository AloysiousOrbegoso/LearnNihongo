import { createReader } from './reader';

export interface Stroke {
  d: string;
  type: string | null;
  order: number;
}

export interface KanjiVgEntry {
  strokeCount: number;
  strokes: Stroke[];
}

export const kanjivgReader = createReader<KanjiVgEntry>('kanjivg');
