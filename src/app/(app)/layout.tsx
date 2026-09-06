import type { ReactNode } from 'react';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { SignOutButton } from '@/components/features/SignOutButton';

const APP_NAV_ITEMS = [
  { href: '/home', label: 'Home' },
  { href: '/decks', label: 'Decks' },
  { href: '/stats', label: 'Stats' },
  { href: '/settings', label: 'Settings' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav
        brandHref="/home"
        brandLabel="NihongoLearn"
        items={APP_NAV_ITEMS}
        action={<SignOutButton />}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>
      <Footer />
    </div>
  );
}
