import type { InputHTMLAttributes } from 'react';

export function Input({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      className={`border-border bg-surface text-foreground focus:border-accent focus:ring-accent/30 rounded-lg border px-3.5 py-2.5 outline-none focus:ring-2 ${className ?? ''}`}
      {...rest}
    />
  );
}
