'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type NavItem = { href: string; label: string };

function ToriiMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-accent shrink-0"
    >
      <path d="M2 6h20" />
      <path d="M4 3.5 3 6" />
      <path d="M20 3.5 21 6" />
      <path d="M4.5 6v14.5" />
      <path d="M19.5 6v14.5" />
      <path d="M2.5 9.5h19" />
    </svg>
  );
}

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
  const pathname = usePathname();

  return (
    <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
        <Link href={brandHref} className="text-foreground flex items-center gap-2 font-bold">
          <ToriiMark />
          {brandLabel}
        </Link>
        <ul className="flex items-center gap-1 text-sm">
          {items.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                    active
                      ? 'bg-accent/15 text-accent-strong'
                      : 'text-muted hover:text-foreground hover:bg-surface-sunken'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="ml-2 flex items-center gap-2">{action}</li>
        </ul>
      </nav>
    </header>
  );
}
