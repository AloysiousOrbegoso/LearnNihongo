import { createClient } from '@/lib/auth/server';
import { upsertProfile } from '@/lib/db/queries/profiles';

export async function getVerifiedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function ensureProfile(userId: string) {
  await upsertProfile({ id: userId, timezone: 'UTC' });
}
