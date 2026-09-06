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

export async function updateProfile({
  id,
  timezone,
  displayName,
  avatar,
}: {
  id: string;
  timezone?: string;
  displayName?: string | null;
  avatar?: string | null;
}) {
  const changes: Partial<typeof profiles.$inferInsert> = {};
  if (timezone !== undefined) changes.timezone = timezone;
  if (displayName !== undefined) changes.displayName = displayName;
  if (avatar !== undefined) changes.avatar = avatar;

  const [profile] = await db.update(profiles).set(changes).where(eq(profiles.id, id)).returning();
  return profile ?? null;
}
