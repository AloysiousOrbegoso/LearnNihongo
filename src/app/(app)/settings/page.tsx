import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getVerifiedUser } from '@/lib/auth/session';
import { getProfile } from '@/lib/db/queries/profiles';
import { resolveTimezone } from '@/lib/timezone';
import { TimezoneForm } from '@/components/features/TimezoneForm';
import { AccountForm } from '@/components/features/AccountForm';

export const metadata: Metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  const user = await getVerifiedUser();
  if (!user) redirect('/sign-in');

  const profile = await getProfile(user.id);
  const timezone = resolveTimezone(profile?.timezone);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-foreground text-2xl font-semibold">Settings</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-lg font-semibold">Account</h2>
        <p className="text-muted text-sm">
          {profile?.avatar ? `${profile.avatar} ` : ''}
          Signed in as {profile?.displayName ?? user.email ?? user.id}
        </p>
        <AccountForm
          currentName={profile?.displayName ?? null}
          currentAvatar={profile?.avatar ?? null}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-foreground text-lg font-semibold">Timezone</h2>
        <p className="text-muted text-sm">
          Used to decide which calendar day a review belongs to for streaks and daily counts.
        </p>
        <TimezoneForm current={timezone} />
      </section>
    </div>
  );
}
