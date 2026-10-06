import Link from 'next/link';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'success' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground',
  secondary: 'bg-accent-2 text-accent-2-foreground',
  success: 'bg-success text-success-foreground',
  ghost: 'border border-border bg-surface text-foreground hover:border-border-strong',
};

const VARIANT_SHADOW: Record<Variant, string | undefined> = {
  primary: 'var(--color-accent-strong)',
  secondary: 'var(--color-accent-2-strong)',
  success: 'var(--color-success-strong)',
  ghost: undefined,
};

const SIZE_CLASS: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-4.5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-[15px]',
};

const BASE_CLASS =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none';

function buttonStyle(variant: Variant, chunky: boolean): CSSProperties {
  if (!chunky) return {};
  const shadow = VARIANT_SHADOW[variant];
  return shadow ? ({ '--btn-shadow': shadow } as CSSProperties) : {};
}

function shapeClass(chunky: boolean) {
  return chunky ? 'rounded-full btn-chunky' : 'rounded-md';
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  chunky?: boolean;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  chunky = false,
  className,
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${BASE_CLASS} ${shapeClass(chunky)} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ''}`}
      style={buttonStyle(variant, chunky)}
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
  chunky = false,
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`${BASE_CLASS} ${shapeClass(chunky)} ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className ?? ''}`}
      style={buttonStyle(variant, chunky)}
    >
      {children}
    </Link>
  );
}
