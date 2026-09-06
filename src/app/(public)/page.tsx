import { Stagger } from '@/components/motion/Stagger';
import { Reveal } from '@/components/motion/Reveal';
import { LinkButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const FEATURES = [
  {
    emoji: '📖',
    title: 'Bidirectional dictionary',
    body: 'Search in Japanese or English across every jōyō kanji and thousands of vocabulary entries.',
  },
  {
    emoji: '🗂️',
    title: 'Decks + spaced repetition',
    body: 'Save words to a deck and let a proven scheduling algorithm decide when you see them again.',
  },
  {
    emoji: '🎴',
    title: 'Practice games',
    body: 'Kana drills, sentence building, and daily trivia keep review from feeling like a chore.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-14">
      <Stagger className="flex flex-col gap-6">
        {[
          <h1 key="heading" className="text-foreground text-4xl font-extrabold text-balance">
            Learn{' '}
            <ruby>
              日本語
              <Reveal as="rt" delay={0.9}>
                にほんご
              </Reveal>
            </ruby>
            , one card at a time.
          </h1>,
          <p key="body" className="text-muted max-w-prose text-lg">
            Look up any word or kanji, save it to a deck, and let spaced repetition decide when you
            see it again. The dictionary is open to everyone; sign in to keep decks and track your
            progress.
          </p>,
          <div key="actions" className="flex flex-wrap gap-3">
            <LinkButton href="/vocab" variant="primary">
              Browse vocabulary
            </LinkButton>
            <LinkButton href="/kanji" variant="ghost">
              Browse kanji
            </LinkButton>
          </div>,
        ]}
      </Stagger>

      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="flex flex-col gap-2">
            <span className="text-2xl" aria-hidden>
              {feature.emoji}
            </span>
            <h2 className="text-foreground font-bold">{feature.title}</h2>
            <p className="text-muted text-sm">{feature.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
