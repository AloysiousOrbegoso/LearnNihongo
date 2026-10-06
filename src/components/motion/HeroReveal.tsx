'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

export function HeroReveal({
  words,
  children,
  actions,
}: {
  words: ReactNode[];
  children: ReactNode;
  actions: ReactNode[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wordEls = gsap.utils.toArray<HTMLElement>(wordsRef.current?.children ?? []);
      const actionEls = gsap.utils.toArray<HTMLElement>(actionsRef.current?.children ?? []);
      const targets = [...wordEls, bodyRef.current, ...actionEls];

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(targets, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap
        .timeline()
        .to(wordEls, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08 })
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25')
        .to(
          actionEls,
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.1 },
          '-=0.2',
        );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="flex flex-col gap-6">
      <h1 className="text-foreground text-4xl font-extrabold text-balance">
        <span ref={wordsRef}>
          {words.map((word, i) => (
            <span key={i} className="inline-block translate-y-3 opacity-0">
              {word}
            </span>
          ))}
        </span>
      </h1>
      <p ref={bodyRef} className="text-muted max-w-prose translate-y-3 text-lg opacity-0">
        {children}
      </p>
      <div ref={actionsRef} className="flex flex-wrap gap-3">
        {actions.map((action, i) => (
          <div key={i} className="translate-y-3 scale-95 opacity-0">
            {action}
          </div>
        ))}
      </div>
    </div>
  );
}
