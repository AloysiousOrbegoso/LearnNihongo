import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getVerifiedUser } from '@/lib/auth/session';
import { isKanaScript } from '@/lib/content/kana';
import { EXAM_SIZES } from '@/lib/kana/exam';
import { KanaExamSession } from '@/components/features/KanaExamSession';

export const metadata: Metadata = {
  title: 'Kana Exam',
};

export default async function KanaExamPage({
  searchParams,
}: {
  searchParams: Promise<{ script?: string; size?: string }>;
}) {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const { script: rawScript, size } = await searchParams;
  const script = rawScript ?? '';
  if (!isKanaScript(script)) redirect('/kana');

  const parsedSize = Number(size);
  if (!EXAM_SIZES.includes(parsedSize as (typeof EXAM_SIZES)[number])) redirect('/kana');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-foreground text-3xl font-extrabold">Exam</h1>
      <KanaExamSession script={script} size={parsedSize} />
    </div>
  );
}
