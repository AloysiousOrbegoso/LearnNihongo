import type { ReactNode } from 'react';

type Tone = 'accent' | 'accent-2' | 'success' | 'gold' | 'muted';

const TONE_CLASS: Record<Tone, string> = {
  accent: 'bg-accent-soft text-accent-soft-foreground',
  'accent-2': 'bg-accent-2-soft text-accent-2-soft-foreground',
  success: 'bg-success-soft text-success-soft-foreground',
  gold: 'bg-gold-soft text-gold-soft-foreground',
  muted: 'bg-surface-sunken text-muted',
};

export function Badge({
  tone = 'muted',
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium ${TONE_CLASS[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
