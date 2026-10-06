import type { ReactNode } from 'react';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { AuthNavAction } from '@/components/ui/AuthNavAction';

const PUBLIC_NAV_ITEMS = [
  { href: '/kanji', label: 'Kanji' },
  { href: '/vocab', label: 'Vocab' },
  { href: '/attributions', label: 'Attributions' },
];

// Widened from max-w-3xl so the landing page can use the room. Pages that
// genuinely want a narrow reading column (kanji/vocab detail, attributions,
// sign-in) apply their own `mx-auto max-w-2xl` wrapper internally instead of
// inheriting one here -- see PROGRESS.md for which pages still need that.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav
        brandHref="/"
        brandLabel="NihongoLearn"
        items={PUBLIC_NAV_ITEMS}
        action={<AuthNavAction />}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
      <Footer />
    </div>
  );
}
