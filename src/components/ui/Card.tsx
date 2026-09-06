import Link from 'next/link';
import type { ReactNode } from 'react';

const BASE_CLASS =
  'card-shadow rounded-xl border border-border bg-surface p-5 transition-transform';

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={`${BASE_CLASS} ${className ?? ''}`}>{children}</div>;
}

export function LinkCard({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${BASE_CLASS} hover:border-accent/40 hover:-translate-y-0.5 ${className ?? ''}`}
    >
      {children}
    </Link>
  );
}
