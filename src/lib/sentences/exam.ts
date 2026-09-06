import { jmdictReader } from '@/lib/content/jmdict';
import {
  CONNECTOR_EXERCISES,
  SIMPLE_POINT_KEY,
  SLOT_TEMPLATES,
  type ConnectorExercise,
  type SentenceTier,
  type SlotCategory,
  type SlotTemplate,
} from '@/lib/content/sentences';
import {
  classifyWord,
  getPool,
  type VocabWord,
  type WordCategory,
} from '@/lib/sentences/vocabPools';

export const MASTERY_STREAK_THRESHOLD = 3;
const SIMPLE_EXAM_SIZE = 10;
const CHOICE_COUNT = 4;
const ALL_CATEGORIES: readonly WordCategory[] = ['noun', 'adjective', 'verb'];

export interface MasteryState {
  correctStreak: number;
  mastered: boolean;
}

export interface SlotFillQuestion {
  kind: 'slotfill';
  templateId: string;
  jp: string;
  en: string;
  choices: { id: string; headword: string; gloss: string }[];
}

export interface ConnectorQuestion {
  kind: 'connector';
  id: string;
  english: string;
  choices: string[];
}

export type ExamQuestion = SlotFillQuestion | ConnectorQuestion;

export interface SlotFillGraded {
  kind: 'slotfill';
  templateId: string;
  selectedId: string;
  selectedHeadword: string;
  correct: boolean;
}

export interface ConnectorGraded {
  kind: 'connector';
  id: string;
  connector: string;
  correct: boolean;
  correctSentence: string;
}

export type GradedItem = SlotFillGraded | ConnectorGraded;

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pick<T>(pool: readonly T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)];
}

function pickUnique(
  pool: readonly VocabWord[],
  count: number,
  exclude: Set<string>,
  random: () => number,
): VocabWord[] {
  const picked: VocabWord[] = [];
  let attempts = 0;
  while (picked.length < count && attempts < pool.length * 5) {
    attempts += 1;
    const candidate = pick(pool, random);
    if (exclude.has(candidate.id)) continue;
    exclude.add(candidate.id);
    picked.push(candidate);
  }
  return picked;
}

function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
}

function decoyPoolFor(template: SlotTemplate): VocabWord[] {
  const decoyCategories = ALL_CATEGORIES.filter(
    (category) => !template.correctCategories.includes(category as SlotCategory),
  );
  return decoyCategories.flatMap((category) => [...getPool(category)]);
}

export function buildSlotFillQuestion(
  template: SlotTemplate,
  random: () => number = Math.random,
): SlotFillQuestion {
  const usedIds = new Set<string>();

  const flavor = template.needsFlavor ? pick(getPool('noun'), random) : null;
  if (flavor) usedIds.add(flavor.id);

  const correctCategory = pick(template.correctCategories, random);
  const correctPool = getPool(correctCategory);
  const [correct] = pickUnique(correctPool, 1, usedIds, random);

  const decoys = pickUnique(decoyPoolFor(template), CHOICE_COUNT - 1, usedIds, random);

  const choices = shuffle([correct, ...decoys], random);

  return {
    kind: 'slotfill',
    templateId: template.id,
    jp: renderTemplate(template.jp, { flavor: flavor?.headword ?? '', choice: '＿' }),
    en: renderTemplate(template.en, { flavor: flavor?.gloss ?? 'It', choice: '___' }),
    choices: choices.map((c) => ({ id: c.id, headword: c.headword, gloss: c.gloss })),
  };
}

export interface SlotFillExample {
  jp: string;
  en: string;
}

export function buildSlotFillExample(
  template: SlotTemplate,
  random: () => number = Math.random,
): SlotFillExample {
  const flavor = template.needsFlavor ? pick(getPool('noun'), random) : null;
  const correctCategory = pick(template.correctCategories, random);
  const choice = pick(getPool(correctCategory), random);

  return {
    jp: renderTemplate(template.jp, { flavor: flavor?.headword ?? '', choice: choice.headword }),
    en: renderTemplate(template.en, { flavor: flavor?.gloss ?? 'It', choice: choice.gloss }),
  };
}

export function buildRandomSlotFillExample(random: () => number = Math.random): SlotFillExample {
  return buildSlotFillExample(pick(SLOT_TEMPLATES, random), random);
}

function poolForTier(tier: 'compound' | 'complex'): readonly ConnectorExercise[] {
  return CONNECTOR_EXERCISES.filter((e) => e.tier === tier);
}

export function buildExam(tier: SentenceTier, random: () => number = Math.random): ExamQuestion[] {
  if (tier === 'simple') {
    return Array.from({ length: SIMPLE_EXAM_SIZE }, () =>
      buildSlotFillQuestion(pick(SLOT_TEMPLATES, random), random),
    );
  }

  const pool = shuffle(poolForTier(tier), random);
  return pool.map((exercise) => ({
    kind: 'connector',
    id: exercise.id,
    english: exercise.english,
    choices: shuffle([exercise.correct, ...exercise.decoys], random),
  }));
}

export function gradeSlotFillAnswer(templateId: string, selectedId: string): SlotFillGraded | null {
  const template = SLOT_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;

  const entry = jmdictReader.getEntry(selectedId);
  if (!entry) return null;
  const headword = entry.kanji[0] ?? entry.kana[0] ?? selectedId;

  const category = classifyWord(selectedId);
  const correct =
    category !== null && template.correctCategories.includes(category as SlotCategory);

  return {
    kind: 'slotfill',
    templateId,
    selectedId,
    selectedHeadword: headword,
    correct,
  };
}

export function gradeConnectorAnswer(id: string, selected: string): ConnectorGraded | null {
  const exercise = CONNECTOR_EXERCISES.find((e) => e.id === id);
  if (!exercise) return null;

  return {
    kind: 'connector',
    id,
    connector: exercise.connector,
    correct: selected === exercise.correct,
    correctSentence: exercise.correct,
  };
}

export function pointKeyForGraded(item: GradedItem): string {
  return item.kind === 'slotfill' ? SIMPLE_POINT_KEY : item.connector;
}

export function nextMasteryState(
  current: MasteryState | undefined,
  correct: boolean,
): MasteryState {
  if (!correct) return { correctStreak: 0, mastered: false };
  const correctStreak = (current?.correctStreak ?? 0) + 1;
  return { correctStreak, mastered: correctStreak >= MASTERY_STREAK_THRESHOLD };
}
