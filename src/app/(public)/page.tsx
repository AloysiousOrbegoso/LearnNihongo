import Link from 'next/link';
import { Stagger } from '@/components/motion/Stagger';
import { Reveal } from '@/components/motion/Reveal';

export default function Home() {
  return (
    <Stagger className="flex flex-col gap-6">
      {[
        <h1 key="heading" className="text-foreground text-3xl font-semibold">
          Learn{' '}
          <ruby>
            日本語
            <Reveal as="rt" delay={0.9}>
              にほんご
            </Reveal>
          </ruby>
          , one card at a time.
        </h1>,
        <p key="body" className="text-muted max-w-prose">
          Look up any word or kanji, save it to a deck, and let spaced repetition decide when you
          see it again. The dictionary is open to everyone; sign in to keep decks and track your
          progress.
        </p>,
        <div key="actions" className="flex flex-wrap gap-3">
          <Link href="/vocab" className="bg-accent text-accent-foreground rounded-md px-4 py-2">
            Browse vocabulary
          </Link>
          <Link href="/kanji" className="border-border text-foreground rounded-md border px-4 py-2">
            Browse kanji
          </Link>
        </div>,
      ]}
    </Stagger>
  );
}
