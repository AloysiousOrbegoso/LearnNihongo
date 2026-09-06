import Link from 'next/link';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'ghost';
type Size = 'md' | 'sm';

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground',
  secondary: 'bg-accent-2 text-accent-2-foreground',
  success: 'bg-success text-success-foreground',
  ghost: 'border border-border bg-surface text-foreground',
};

const VARIANT_SHADOW: Record<Variant, string | undefined> = {
  primary: 'var(--color-accent-strong)',
  secondary: 'var(--color-accent-2-strong)',
  success: 'var(--color-success-strong)',
  ghost: undefined,
};

const SIZE_CLASS: Record<Size, string> = {
  md: 'px-5 py-2.5 text-sm',
  sm: 'px-3.5 py-1.5 text-sm',
};

const BASE_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold btn-chunky disabled:opacity-50 disabled:pointer-events-none';

function buttonStyle(variant: Variant): CSSProperties {
  const shadow = VARIANT_SHADOW[variant];
  return shadow ? ({ '--btn-shadow': shadow } as CSSProperties) : {};
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ''}`}
      style={buttonStyle(variant)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`${BASE_CLASS} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ''}`}
      style={buttonStyle(variant)}
    >
      {children}
    </Link>
  );
}
