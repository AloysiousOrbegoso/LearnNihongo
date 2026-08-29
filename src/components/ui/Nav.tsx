import Link from 'next/link';
import type { ReactNode } from 'react';

type NavItem = { href: string; label: string };

export function Nav({
  brandHref,
  brandLabel,
  items,
  action,
}: {
  brandHref: string;
  brandLabel: string;
  items: NavItem[];
  action: ReactNode;
}) {
  return (
    <header className="border-border border-b">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href={brandHref} className="text-foreground font-semibold">
          {brandLabel}
        </Link>
        <ul className="flex items-center gap-6 text-sm">
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-muted hover:text-foreground">
                {item.label}
              </Link>
            </li>
          ))}
          <li>{action}</li>
        </ul>
      </nav>
    </header>
  );
}
