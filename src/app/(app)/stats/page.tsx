import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getVerifiedUser } from '@/lib/auth/session';
import { getProfile } from '@/lib/db/queries/profiles';
import { getStats } from '@/lib/db/queries/stats';
import { resolveTimezone } from '@/lib/timezone';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';

export const metadata: Metadata = {
  title: 'Stats',
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-muted text-xs font-semibold tracking-wide uppercase">{label}</span>
      <span className="text-foreground text-3xl font-extrabold">{value}</span>
    </Card>
  );
}

export default async function StatsPage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const profile = await getProfile(user.id);
  const timezone = resolveTimezone(profile?.timezone);
  const stats = await getStats({ userId: user.id, now: new Date(), timezone });
  const maxCount = Math.max(1, ...stats.history.map((entry) => entry.count));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-foreground text-3xl font-extrabold">Stats</h1>
        <span className="text-muted text-sm">Days counted in {timezone}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Due now" value={String(stats.dueNow)} />
        <StatCard label="Reviews today" value={String(stats.reviewsToday)} />
        <StatCard
          label="Streak"
          value={`${stats.streakDays} ${stats.streakDays === 1 ? 'day' : 'days'}`}
        />
        <StatCard label="Total cards" value={String(stats.totalCards)} />
        <StatCard
          label="Retention (30d)"
          value={stats.retention === null ? '—' : `${Math.round(stats.retention * 100)}%`}
        />
        <StatCard label="In review" value={String(stats.byState.review)} />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-lg font-bold">Last 14 days</h2>
        <ul className="flex flex-col gap-2">
          {stats.history.map((entry) => (
            <li key={entry.day} className="flex items-center gap-3 text-sm">
              <span className="text-muted w-24 shrink-0 tabular-nums">{entry.day.slice(5)}</span>
              <ProgressBar value={entry.count} max={maxCount} className="flex-1" />
              <span className="text-foreground w-8 text-right tabular-nums">{entry.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-lg font-bold">Cards by stage</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-muted">New</dt>
            <dd className="text-foreground">{stats.byState.new}</dd>
          </div>
          <div>
            <dt className="text-muted">Learning</dt>
            <dd className="text-foreground">{stats.byState.learning}</dd>
          </div>
          <div>
            <dt className="text-muted">Review</dt>
            <dd className="text-foreground">{stats.byState.review}</dd>
          </div>
          <div>
            <dt className="text-muted">Relearning</dt>
            <dd className="text-foreground">{stats.byState.relearning}</dd>
          </div>
        </dl>
        <p className="text-muted text-xs">
          Retention is the share of due reviews over the last 30 days that you rated Hard, Good, or
          Easy.
        </p>
      </section>
    </div>
  );
}
