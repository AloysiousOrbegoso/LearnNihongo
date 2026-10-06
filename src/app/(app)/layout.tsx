import type { ReactNode } from 'react';
import { AppChrome } from '@/components/ui/AppChrome';
import { SignOutButton } from '@/components/features/SignOutButton';
import { getVerifiedUser } from '@/lib/auth/session';
import { getProfile } from '@/lib/db/queries/profiles';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getVerifiedUser();
  const profile = user ? await getProfile(user.id) : null;
  const name = profile?.displayName ?? user?.email ?? null;

  return (
    <AppChrome
      navAction={
        <>
          {name && (
            <span className="text-muted hidden items-center gap-1.5 text-sm sm:flex">
              {profile?.avatar && <span aria-hidden>{profile.avatar}</span>}
              {name}
            </span>
          )}
          <SignOutButton />
        </>
      }
    >
      {children}
    </AppChrome>
  );
}
