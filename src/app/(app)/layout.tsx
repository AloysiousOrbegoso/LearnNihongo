import type { ReactNode } from 'react';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { SignOutButton } from '@/components/features/SignOutButton';

const APP_NAV_ITEMS = [
  { href: '/decks', label: 'Decks' },
  { href: '/review', label: 'Review' },
  { href: '/stats', label: 'Stats' },
  { href: '/kanji', label: 'Kanji' },
  { href: '/vocab', label: 'Vocab' },
  { href: '/settings', label: 'Settings' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav
        brandHref="/decks"
        brandLabel="NihongoLearn"
        items={APP_NAV_ITEMS}
        action={<SignOutButton />}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>
      <Footer />
    </div>
  );
}
