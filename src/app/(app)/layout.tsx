import type { ReactNode } from 'react';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';

const APP_NAV_ITEMS = [
  { href: '/decks', label: 'Decks' },
  { href: '/review', label: 'Review' },
  { href: '/stats', label: 'Stats' },
  { href: '/settings', label: 'Settings' },
];

// Structure only — no session check yet. Anyone can currently reach anything
// under (app) directly by URL. Slice 1's middleware + per-route auth checks
// (CLAUDE.md §5.3/5.4) are what actually gate this.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav
        brandHref="/decks"
        brandLabel="NihongoLearn"
        items={APP_NAV_ITEMS}
        action={
          <button
            type="button"
            disabled
            title="Wired up in Slice 1"
            className="border-border text-muted rounded-md border px-3 py-1.5"
          >
            Sign out
          </button>
        }
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>
      <Footer />
    </div>
  );
}
