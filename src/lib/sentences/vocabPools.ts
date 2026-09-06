import { BEGINNER_ADJECTIVES, BEGINNER_NOUNS, BEGINNER_VERBS } from '@/lib/content/beginnerVocab';
import type { VocabWord } from '@/lib/content/beginnerVocab';

export type { VocabWord };
export type WordCategory = 'noun' | 'adjective' | 'verb';

const POOLS: Record<WordCategory, readonly VocabWord[]> = {
  noun: BEGINNER_NOUNS,
  adjective: BEGINNER_ADJECTIVES,
  verb: BEGINNER_VERBS,
};

export function getPool(category: WordCategory): readonly VocabWord[] {
  return POOLS[category];
}

export function classifyWord(id: string): WordCategory | null {
  for (const category of Object.keys(POOLS) as WordCategory[]) {
    if (POOLS[category].some((word) => word.id === id)) return category;
  }
  return null;
}
