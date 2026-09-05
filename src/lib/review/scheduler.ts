import { fsrs, generatorParameters, Rating, type Card, type Grade, type State } from 'ts-fsrs';

export interface SchedulableCard {
  due: Date;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  learningSteps: number;
  reps: number;
  lapses: number;
  state: number;
  lastReview: Date | null;
}

export interface ReviewOutcome {
  card: SchedulableCard;
  log: {
    rating: number;
    state: number;
    scheduledDays: number;
    elapsedDays: number;
    reviewedAt: Date;
  };
}

export const GRADES: readonly Grade[] = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy];

const scheduler = fsrs(generatorParameters({ enable_fuzz: false }));

function toFsrsCard(card: SchedulableCard): Card {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    learning_steps: card.learningSteps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as State,
    last_review: card.lastReview ?? undefined,
  };
}

function fromFsrsCard(card: Card): SchedulableCard {
  return {
    due: card.due,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    learningSteps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.last_review ?? null,
  };
}

export function isGrade(value: number): value is Grade {
  return GRADES.includes(value as Grade);
}

export function scheduleReview(card: SchedulableCard, grade: Grade, now: Date): ReviewOutcome {
  const { card: next, log } = scheduler.next(toFsrsCard(card), now, grade);

  return {
    card: fromFsrsCard(next),
    log: {
      rating: log.rating,
      state: log.state,
      scheduledDays: log.scheduled_days,
      elapsedDays: log.elapsed_days,
      reviewedAt: log.review,
    },
  };
}

export function previewIntervals(card: SchedulableCard, now: Date): Record<Grade, string> {
  const preview = scheduler.repeat(toFsrsCard(card), now);
  const label = (grade: Grade) => formatInterval(preview[grade].card.due.getTime() - now.getTime());

  return {
    [Rating.Again]: label(Rating.Again),
    [Rating.Hard]: label(Rating.Hard),
    [Rating.Good]: label(Rating.Good),
    [Rating.Easy]: label(Rating.Easy),
  };
}

export function formatInterval(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.round(days / 365)}y`;
}
