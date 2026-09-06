import type { ReactNode } from 'react';

type Tone = 'accent' | 'accent-2' | 'success' | 'gold' | 'muted';

const TONE_CLASS: Record<Tone, string> = {
  accent: 'bg-accent/15 text-accent-strong',
  'accent-2': 'bg-accent-2/15 text-accent-2-strong',
  success: 'bg-success/15 text-success-strong',
  gold: 'bg-gold/20 text-gold-strong',
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
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${TONE_CLASS[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
