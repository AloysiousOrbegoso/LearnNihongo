import { NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiResponse } from '@/types/api';

export function ok<T>(data: T) {
  return NextResponse.json<ApiResponse<T>>({ ok: true, data });
}

export function fail(code: string, message: string, status: number, details?: unknown) {
  return NextResponse.json<ApiResponse<never>>(
    { ok: false, error: { code, message, ...(details === undefined ? {} : { details }) } },
    { status },
  );
}

export const unauthenticated = () => fail('UNAUTHENTICATED', 'Sign in required.', 401);
export const notFound = (message: string) => fail('NOT_FOUND', message, 404);
export const rateLimited = () => fail('RATE_LIMITED', 'Too many attempts. Try again later.', 429);
export const validationFailed = (error: z.ZodError) =>
  fail('VALIDATION_FAILED', 'Invalid input.', 400, z.flattenError(error));

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
