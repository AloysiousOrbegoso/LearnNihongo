import { getVerifiedUser } from '@/lib/auth/session';
import { buildExam } from '@/lib/sentences/exam';
import { getTierProgress } from '@/lib/db/queries/sentences';
import { sentenceTierSchema } from '@/schemas/sentences';
import { fail, ok, unauthenticated, validationFailed } from '@/lib/api';

export async function GET(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { searchParams } = new URL(request.url);
  const parsed = sentenceTierSchema.safeParse(searchParams.get('tier'));
  if (!parsed.success) return validationFailed(parsed.error);

  const tier = parsed.data;
  const progress = await getTierProgress(user.id);
  if (!progress[tier].unlocked) return fail('FORBIDDEN', 'This tier is locked.', 403);

  return ok({ tier, questions: buildExam(tier) });
}
