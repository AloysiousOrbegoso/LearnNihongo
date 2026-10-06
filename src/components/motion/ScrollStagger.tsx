'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollStagger({
  children,
  gap = 0.12,
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
        gsap.set(items, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: gap,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div key={i} className="translate-y-4 scale-95 opacity-0">
          {child}
        </div>
      ))}
    </div>
  );
}
