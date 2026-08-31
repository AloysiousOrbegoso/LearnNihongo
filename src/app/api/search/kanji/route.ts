import { NextResponse } from 'next/server';
import { searchKanji } from '@/lib/content/search';
import type { ApiResponse } from '@/types/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') ?? '';
  const results = searchKanji(q);
  return NextResponse.json<ApiResponse<typeof results>>({ ok: true, data: results });
}
