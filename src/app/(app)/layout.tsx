import type { ReactNode } from 'react';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { SignOutButton } from '@/components/features/SignOutButton';
import { getVerifiedUser } from '@/lib/auth/session';
import { getProfile } from '@/lib/db/queries/profiles';

const APP_NAV_ITEMS = [
  { href: '/home', label: 'Home' },
  { href: '/decks', label: 'Decks' },
  { href: '/stats', label: 'Stats' },
  { href: '/settings', label: 'Settings' },
];

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getVerifiedUser();
  const profile = user ? await getProfile(user.id) : null;
  const name = profile?.displayName ?? user?.email ?? null;

  return (
    <div className="flex min-h-dvh flex-col">
      <Nav
        brandHref="/home"
        brandLabel="NihongoLearn"
        items={APP_NAV_ITEMS}
        action={
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
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>
      <Footer />
    </div>
  );
}
