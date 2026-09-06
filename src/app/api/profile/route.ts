import { getVerifiedUser } from '@/lib/auth/session';
import { updateProfile } from '@/lib/db/queries/profiles';
import { updateProfileSchema } from '@/schemas/profile';
import { notFound, ok, readJson, unauthenticated, validationFailed } from '@/lib/api';

export async function PATCH(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const parsed = updateProfileSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailed(parsed.error);

  const profile = await updateProfile({ id: user.id, ...parsed.data });
  if (!profile) return notFound('Profile not found.');

  return ok({
    timezone: profile.timezone,
    displayName: profile.displayName,
    avatar: profile.avatar,
  });
}
