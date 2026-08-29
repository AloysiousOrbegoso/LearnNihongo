'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function Stagger({
  children,
  gap = 0.08,
  className,
}: {
  children: ReactNode[];
  gap?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(ref.current?.children ?? []);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: gap,
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div key={i} className="translate-y-2 opacity-0">
          {child}
        </div>
      ))}
    </div>
  );
}
