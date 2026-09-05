import { getVerifiedUser } from '@/lib/auth/session';
import { createDeck, getUserDecks } from '@/lib/db/queries/decks';
import { createDeckSchema } from '@/schemas/decks';
import { ok, readJson, unauthenticated, validationFailed } from '@/lib/api';

export async function GET() {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  return ok(await getUserDecks(user.id));
}

export async function POST(request: Request) {
  const user = await getVerifiedUser();
  if (!user) return unauthenticated();

  const parsed = createDeckSchema.safeParse(await readJson(request));
  if (!parsed.success) return validationFailed(parsed.error);

  return ok(await createDeck({ userId: user.id, name: parsed.data.name }));
}
