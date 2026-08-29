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
          Learn Nihongo through spaced repetition. This is Slice 0.5: shell only, no accounts or
          decks yet.
        </p>,
      ]}
    </Stagger>
  );
}
