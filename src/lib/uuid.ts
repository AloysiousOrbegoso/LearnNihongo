import { z } from 'zod';

const uuidSchema = z.uuid();

export function isUuid(value: string | null | undefined): value is string {
  return uuidSchema.safeParse(value).success;
}
