import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { isKanaScript } from '@/lib/content/kana';
import { KanaFlashcards } from '@/components/features/KanaFlashcards';

export const metadata: Metadata = {
  title: 'Kana Practice',
};

export default async function KanaPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ script?: string }>;
}) {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const { script: rawScript } = await searchParams;
  const script = rawScript ?? '';
  const initialScript = isKanaScript(script) ? script : 'hiragana';

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-3xl font-extrabold">Practice</h1>
      <KanaFlashcards initialScript={initialScript} />
    </div>
  );
}
