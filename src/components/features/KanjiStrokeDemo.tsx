'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Stroke } from '@/lib/content/kanjivg';

gsap.registerPlugin(ScrollTrigger);

export function KanjiStrokeDemo({
  strokes,
  reading,
  meanings,
}: {
  strokes: Stroke[];
  reading: string;
  meanings: string[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const paths = svgRef.current?.querySelectorAll('path');
      if (!paths || paths.length === 0) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(captionRef.current, { opacity: 1, y: 0 });
        return;
      }

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })
        .to(paths, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out', stagger: 0.18 })
        .to(captionRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.1');
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 109 109"
        width={140}
        height={140}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-foreground shrink-0"
      >
        {strokes.map((stroke) => (
          <path key={stroke.order} d={stroke.d} />
        ))}
      </svg>
      <div
        ref={captionRef}
        className="flex translate-y-2 flex-col gap-1 text-center opacity-0 sm:text-left"
      >
        <span className="font-jp text-muted text-lg">{reading}</span>
        <span className="text-foreground text-2xl font-bold">{meanings.join(', ')}</span>
        <p className="text-muted max-w-xs text-sm">
          Every jōyō kanji on this site draws its real stroke order, pulled from actual stroke-path
          data rather than a static image.
        </p>
      </div>
    </div>
  );
}
