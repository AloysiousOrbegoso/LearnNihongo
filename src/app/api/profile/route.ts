import { getVerifiedUser } from '@/lib/auth/session';
import { updateProfileTimezone } from '@/lib/db/queries/profiles';
import { updateProfileSchema } from '@/schemas/profile';
import { notFound, ok, readJson, unauthenticated, validationFailed } from '@/lib/api';

export async function PATCH(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const parsed = updateProfileSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailed(parsed.error);

  const profile = await updateProfileTimezone({ id: user.id, timezone: parsed.data.timezone });
  if (!profile) return notFound('Profile not found.');

  return ok({ timezone: profile.timezone });
}
