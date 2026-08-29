import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/auth/server';
import { resetPasswordSchema } from '@/schemas/auth';
import { authRateLimit } from '@/lib/rate-limit';
import type { ApiResponse } from '@/types/api';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await authRateLimit.limit(`reset-password:${ip}`);

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
  const parsed = resetPasswordSchema.safeParse(body);

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

  await supabase.auth.resetPasswordForEmail(parsed.data.email);

  return NextResponse.json<ApiResponse<{ message: string }>>({
    ok: true,
    data: { message: 'If an account exists for that email, a reset link has been sent.' },
  });
}
