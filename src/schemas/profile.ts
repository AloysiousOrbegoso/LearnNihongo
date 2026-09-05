import { z } from 'zod';
import { isValidTimezone } from '@/lib/timezone';

export const updateProfileSchema = z.object({
  timezone: z.string().min(1).max(64).refine(isValidTimezone, 'Unknown timezone'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
