import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { EXAM_SIZES } from '@/lib/kana/exam';
import type { KanaScript } from '@/lib/content/kana';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LinkButton } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Kana Practice',
};

const SCRIPTS: { key: KanaScript; label: string }[] = [
  { key: 'hiragana', label: 'Hiragana' },
  { key: 'katakana', label: 'Katakana' },
];

export default async function KanaPage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const summary = await getMasterySummary(user.id);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-foreground text-3xl font-extrabold">Kana Practice</h1>
      <p className="text-muted text-sm">
        Practice freely any time. Progress only updates after you take an exam.
      </p>
      {SCRIPTS.map(({ key, label }) => {
        const stats = summary[key];
        const percent = stats.total === 0 ? 0 : Math.round((stats.mastered / stats.total) * 100);

        return (
          <Card key={key} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-lg font-bold">{label}</h2>
              <span className="text-muted text-sm">
                {stats.mastered} / {stats.total} mastered ({percent}%)
              </span>
            </div>
            <ProgressBar value={stats.mastered} max={stats.total} tone="success" />
            <div className="flex flex-wrap items-center gap-3">
              <LinkButton href={`/kana/practice?script=${key}`} variant="ghost" size="sm">
                Practice
              </LinkButton>
              {EXAM_SIZES.map((size) => (
                <LinkButton key={size} href={`/kana/exam?script=${key}&size=${size}`} size="sm">
                  Exam ({size})
                </LinkButton>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
