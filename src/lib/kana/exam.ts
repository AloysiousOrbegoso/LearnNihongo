import { getKanaSet, type KanaCharacter, type KanaScript } from '@/lib/content/kana';

export const MASTERY_STREAK_THRESHOLD = 3;
export const CHOICE_COUNT = 4;
export const EXAM_SIZES = [10, 25, 46] as const;

export interface MasteryState {
  correctStreak: number;
  mastered: boolean;
}

export interface ExamQuestion {
  character: string;
  choices: string[];
}

export interface GradedAnswer {
  character: string;
  selected: string;
  correct: boolean;
  correctRomaji: string;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function weightFor(mastery: MasteryState | undefined): number {
  if (!mastery) return 3;
  if (mastery.mastered) return 1;
  return 3 - Math.min(mastery.correctStreak, 2);
}

export function pickExamCharacters(
  script: KanaScript,
  size: number,
  masteryByCharacter: Map<string, MasteryState>,
  random: () => number = Math.random,
): KanaCharacter[] {
  const pool = [...getKanaSet(script)];
  const clampedSize = Math.min(size, pool.length);
  const picked: KanaCharacter[] = [];
  const remaining = [...pool];

  while (picked.length < clampedSize && remaining.length > 0) {
    const weights = remaining.map((entry) => weightFor(masteryByCharacter.get(entry.character)));
    const total = weights.reduce((sum, w) => sum + w, 0);
    let roll = random() * total;
    let index = 0;
    for (; index < weights.length - 1; index += 1) {
      roll -= weights[index];
      if (roll < 0) break;
    }
    picked.push(remaining[index]);
    remaining.splice(index, 1);
  }

  return picked;
}

export function buildQuestion(
  entry: KanaCharacter,
  script: KanaScript,
  random: () => number = Math.random,
): ExamQuestion {
  const seenRomaji = new Set([entry.romaji]);
  const decoys = shuffle([...getKanaSet(script)], random)
    .filter((other) => {
      if (seenRomaji.has(other.romaji)) return false;
      seenRomaji.add(other.romaji);
      return true;
    })
    .slice(0, CHOICE_COUNT - 1)
    .map((other) => other.romaji);

  return {
    character: entry.character,
    choices: shuffle([entry.romaji, ...decoys], random),
  };
}

export function gradeAnswer(
  script: KanaScript,
  character: string,
  selected: string,
): GradedAnswer | null {
  const entry = getKanaSet(script).find((k) => k.character === character);
  if (!entry) return null;

  return {
    character,
    selected,
    correct: selected === entry.romaji,
    correctRomaji: entry.romaji,
  };
}

export function nextMasteryState(
  current: MasteryState | undefined,
  correct: boolean,
): MasteryState {
  if (!correct) return { correctStreak: 0, mastered: false };
  const correctStreak = (current?.correctStreak ?? 0) + 1;
  return { correctStreak, mastered: correctStreak >= MASTERY_STREAK_THRESHOLD };
}
