type Tone = 'accent' | 'accent-2' | 'success' | 'gold';

const FILL_CLASS: Record<Tone, string> = {
  accent: 'bg-accent',
  'accent-2': 'bg-accent-2',
  success: 'bg-success',
  gold: 'bg-gold',
};

export function ProgressBar({
  value,
  max,
  tone = 'accent',
  className,
}: {
  value: number;
  max: number;
  tone?: Tone;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`bg-surface-sunken h-3 w-full overflow-hidden rounded-full ${className ?? ''}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${FILL_CLASS[tone]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
