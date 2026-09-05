import { z } from 'zod';

export const createDeckSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
});

export const addCardSchema = z.object({
  contentSource: z.enum(['jmdict', 'kanjidic']),
  contentId: z.string().min(1),
  contentVersion: z.string().min(1),
  snapshotWord: z.string().min(1),
  snapshotReading: z.string().min(1),
  snapshotGloss: z.string().min(1),
});

export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type AddCardInput = z.infer<typeof addCardSchema>;
