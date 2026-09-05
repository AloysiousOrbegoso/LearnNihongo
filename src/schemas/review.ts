import { z } from 'zod';

export const reviewQueueSchema = z.object({
  deckId: z.uuid().optional(),
});

export const reviewAnswerSchema = z.object({
  cardId: z.uuid(),
  rating: z.number().int().min(1).max(4),
});

export type ReviewAnswerInput = z.infer<typeof reviewAnswerSchema>;
