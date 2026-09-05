import type { ReactNode } from 'react';
import { Nav } from '@/components/ui/Nav';
import { Footer } from '@/components/ui/Footer';
import { AuthNavAction } from '@/components/ui/AuthNavAction';

const PUBLIC_NAV_ITEMS = [
  { href: '/kanji', label: 'Kanji' },
  { href: '/vocab', label: 'Vocab' },
  { href: '/attributions', label: 'Attributions' },
];

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Nav
        brandHref="/"
        brandLabel="NihongoLearn"
        items={PUBLIC_NAV_ITEMS}
        action={<AuthNavAction />}
      />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">{children}</main>
      <Footer />
    </div>
  );
}
