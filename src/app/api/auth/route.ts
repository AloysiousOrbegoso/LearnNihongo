import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/auth/server';
import { signUpSchema } from '@/schemas/auth';
import { authRateLimit } from '@/lib/rate-limit';
import type { ApiResponse } from '@/types/api';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await authRateLimit.limit(`sign-up:${ip}`);

  if (!success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        ok: false,
        error: { code: 'RATE_LIMITED', message: 'Too many attempts. Try again later.' },
      },
      { status: 429 },
    );
  }

  const body = await request.json();
  const parsed = signUpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json<ApiResponse<never>>(
      {
        ok: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid input.',
          details: z.flattenError(parsed.error),
        },
      },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return NextResponse.json<ApiResponse<never>>(
      { ok: false, error: { code: 'INTERNAL', message: 'Could not create account.' } },
      { status: 500 },
    );
  }

  return NextResponse.json<ApiResponse<{ message: string }>>({
    ok: true,
    data: { message: 'Check your email to confirm your account.' },
  });
}
