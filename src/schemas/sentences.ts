import { z } from 'zod';

export const sentenceTierSchema = z.enum(['simple', 'compound', 'complex']);

const slotFillAnswerSchema = z.object({
  kind: z.literal('slotfill'),
  templateId: z.string().min(1),
  selectedId: z.string().min(1),
});

const connectorAnswerSchema = z.object({
  kind: z.literal('connector'),
  id: z.string().min(1),
  selected: z.string().min(1).max(200),
});

export const examSubmitSchema = z.object({
  tier: sentenceTierSchema,
  answers: z.union([z.array(slotFillAnswerSchema).min(1), z.array(connectorAnswerSchema).min(1)]),
});

export type ExamSubmitInput = z.infer<typeof examSubmitSchema>;
