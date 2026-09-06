import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getVerifiedUser } from '@/lib/auth/session';
import { getMasterySummary } from '@/lib/db/queries/kana';
import { EXAM_SIZES } from '@/lib/kana/exam';
import type { KanaScript } from '@/lib/content/kana';

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
      <h1 className="text-foreground text-2xl font-semibold">Kana Practice</h1>
      <p className="text-muted text-sm">
        Practice freely any time. Progress only updates after you take an exam.
      </p>
      {SCRIPTS.map(({ key, label }) => {
        const stats = summary[key];
        const percent = stats.total === 0 ? 0 : Math.round((stats.mastered / stats.total) * 100);

        return (
          <section
            key={key}
            className="border-border bg-surface flex flex-col gap-4 rounded-lg border p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-lg font-semibold">{label}</h2>
              <span className="text-muted text-sm">
                {stats.mastered} / {stats.total} mastered ({percent}%)
              </span>
            </div>
            <div className="bg-background h-2 overflow-hidden rounded-full">
              <div className="bg-accent h-full rounded-full" style={{ width: `${percent}%` }} />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/kana/practice?script=${key}`}
                className="border-border text-foreground rounded-md border px-3 py-1.5 text-sm"
              >
                Practice
              </Link>
              {EXAM_SIZES.map((size) => (
                <Link
                  key={size}
                  href={`/kana/exam?script=${key}&size=${size}`}
                  className="bg-accent text-accent-foreground rounded-md px-3 py-1.5 text-sm"
                >
                  Exam ({size})
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
