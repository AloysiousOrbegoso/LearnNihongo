import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { profiles } from '@/lib/db/schema';

export async function upsertProfile({ id, timezone }: { id: string; timezone: string }) {
  await db.insert(profiles).values({ id, timezone }).onConflictDoNothing();
}

export async function getProfile(id: string) {
  const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
  return profile ?? null;
}

export async function updateProfileTimezone({ id, timezone }: { id: string; timezone: string }) {
  const [profile] = await db
    .update(profiles)
    .set({ timezone })
    .where(eq(profiles.id, id))
    .returning();
  return profile ?? null;
}
