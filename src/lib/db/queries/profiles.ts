import { db } from '@/lib/db/client';
import { profiles } from '@/lib/db/schema';

export async function upsertProfile({ id, timezone }: { id: string; timezone: string }) {
  await db.insert(profiles).values({ id, timezone }).onConflictDoNothing();
}
