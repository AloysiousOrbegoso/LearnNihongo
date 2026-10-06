import type { InputHTMLAttributes } from 'react';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`border-border bg-surface text-foreground placeholder:text-subtle focus:border-accent focus:ring-accent-soft w-full rounded-md border px-3.5 py-2.5 text-sm outline-none focus:ring-2 ${className ?? ''}`}
      {...rest}
    />
  );
}
