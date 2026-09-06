import { getVerifiedUser } from '@/lib/auth/session';
import { getMasteryMap } from '@/lib/db/queries/kana';
import { buildQuestion, pickExamCharacters } from '@/lib/kana/exam';
import { examRequestSchema } from '@/schemas/kana';
import { ok, unauthenticated, validationFailed } from '@/lib/api';

export async function GET(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const { searchParams } = new URL(request.url);
  const parsed = examRequestSchema.safeParse({
    script: searchParams.get('script'),
    size: searchParams.get('size'),
  });
  if (!parsed.success) return validationFailed(parsed.error);

  const { script, size } = parsed.data;
  const mastery = await getMasteryMap(user.id, script);
  const characters = pickExamCharacters(script, size, mastery);
  const questions = characters.map((entry) => buildQuestion(entry, script));

  return ok({ script, questions });
}
