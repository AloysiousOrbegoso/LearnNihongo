'use client';

import { useRef, type ElementType, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(ref.current, { opacity: 1, y: 0 });
        return;
      }
      gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: 'power2.out',
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`translate-y-2 opacity-0 ${className ?? ''}`.trim()}>
      {children}
    </Tag>
  );
}
