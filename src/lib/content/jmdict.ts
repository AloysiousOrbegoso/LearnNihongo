import { createReader } from './reader';

export interface JmdictEntry {
  kanji: string[];
  kana: string[];
  senses: { partOfSpeech: string[]; glosses: string[] }[];
}

export const jmdictReader = createReader<JmdictEntry>('jmdict');
