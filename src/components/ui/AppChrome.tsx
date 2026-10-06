'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';

const APP_NAV_ITEMS = [
  { href: '/home', label: 'Home' },
  { href: '/decks', label: 'Decks' },
  { href: '/stats', label: 'Stats' },
  { href: '/settings', label: 'Settings' },
];

// Full-screen, keyboard-first session routes drop nav/footer chrome so the
// card and grading controls get the whole viewport. Matched by pathname
// rather than a route group, since CLAUDE.md forbids renaming/moving files
// and a route group would require restructuring app/(app)/.
function isSessionRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === '/review') return true;
  if (pathname === '/kana/exam') return true;
  if (/^\/sentences\/[^/]+\/exam$/.test(pathname)) return true;
  return false;
}

export function AppChrome({ navAction, children }: { navAction: ReactNode; children: ReactNode }) {
  const pathname = usePathname();

  if (isSessionRoute(pathname)) {
    return <div className="min-h-dvh">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <Nav brandHref="/home" brandLabel="NihongoLearn" items={APP_NAV_ITEMS} action={navAction} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}
