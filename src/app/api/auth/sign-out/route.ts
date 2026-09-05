import { createClient } from '@/lib/auth/server';
import { ok } from '@/lib/api';

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  return ok({ redirectTo: '/' });
}
