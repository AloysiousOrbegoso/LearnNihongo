import { z } from 'zod';
import { EXAM_SIZES } from '@/lib/kana/exam';

export const kanaScriptSchema = z.enum(['hiragana', 'katakana']);

export const examRequestSchema = z.object({
  script: kanaScriptSchema,
  size: z.coerce
    .number()
    .int()
    .refine((n) => (EXAM_SIZES as readonly number[]).includes(n), {
      message: 'Invalid exam size',
    }),
});

export const examSubmitSchema = z.object({
  script: kanaScriptSchema,
  answers: z
    .array(
      z.object({
        character: z.string().min(1).max(4),
        selected: z.string().min(1).max(10),
      }),
    )
    .min(1)
    .max(46),
});

export type ExamSubmitInput = z.infer<typeof examSubmitSchema>;
