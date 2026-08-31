import type { Stroke } from '@/lib/content/kanjivg';

export function StrokeOrder({ strokes }: { strokes: Stroke[] }) {
  return (
    <svg viewBox="0 0 109 109" width={109} height={109} className="text-foreground">
      {strokes.map((stroke) => (
        <path
          key={stroke.order}
          d={stroke.d}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
