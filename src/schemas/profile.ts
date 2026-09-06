import { z } from 'zod';
import { isValidTimezone } from '@/lib/timezone';

export const AVATAR_OPTIONS = [
  '🐱',
  '🐶',
  '🦊',
  '🐼',
  '🐨',
  '🦁',
  '🐸',
  '🐧',
  '🦉',
  '🐢',
  '🐙',
  '🦈',
  '🌸',
  '🍜',
  '🍙',
  '⛩️',
  '🗻',
  '🎴',
] as const;

export const updateProfileSchema = z
  .object({
    timezone: z.string().min(1).max(64).refine(isValidTimezone, 'Unknown timezone').optional(),
    displayName: z.string().trim().min(1).max(40).nullable().optional(),
    avatar: z.enum(AVATAR_OPTIONS).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'No fields to update');

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AvatarOption = (typeof AVATAR_OPTIONS)[number];
