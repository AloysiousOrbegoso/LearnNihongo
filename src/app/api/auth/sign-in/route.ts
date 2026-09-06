import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/auth/server';
import { ensureProfile } from '@/lib/auth/session';
import { signInSchema } from '@/schemas/auth';
import { authRateLimit } from '@/lib/rate-limit';
import type { ApiResponse } from '@/types/api';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await authRateLimit.limit(`sign-in:${ip}`);

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
  const parsed = signInSchema.safeParse(body);

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
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return NextResponse.json<ApiResponse<never>>(
      { ok: false, error: { code: 'UNAUTHENTICATED', message: 'Invalid email or password.' } },
      { status: 401 },
    );
  }

  await ensureProfile(data.user.id);

  return NextResponse.json<ApiResponse<{ redirectTo: string }>>({
    ok: true,
    data: { redirectTo: '/home' },
  });
}
