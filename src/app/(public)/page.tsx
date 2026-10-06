import { Stagger } from '@/components/motion/Stagger';
import { Reveal } from '@/components/motion/Reveal';
import { LinkButton } from '@/components/ui/Button';
import { jmdictReader } from '@/lib/content/jmdict';
import { kanjidicReader } from '@/lib/content/kanjidic';

// Real counts from the content shards, never hardcoded -- CLAUDE.md forbids
// fabricating figures, and these numbers move as the dataset grows.
const VOCAB_COUNT = jmdictReader.getAllIds().length;
const KANJI_COUNT = kanjidicReader.getAllIds().length;

const STATS = [
  { value: VOCAB_COUNT.toLocaleString(), label: 'Vocabulary words' },
  { value: KANJI_COUNT.toLocaleString(), label: 'Jōyō kanji' },
  { value: 'FSRS', label: 'Scheduling engine' },
  { value: 'Free', label: 'No account needed to browse' },
];

const FEATURES = [
  {
    icon: '書',
    title: 'Bidirectional dictionary',
    body: 'Search in Japanese or English across every jōyō kanji and thousands of vocabulary entries.',
  },
  {
    icon: '習',
    title: 'Decks and spaced repetition',
    body: 'Save words to a deck and let FSRS decide when you see them again, right before you forget.',
  },
  {
    icon: '遊',
    title: 'Practice that keeps score',
    body: 'Kana drills, sentence building, and daily trivia -- review that does not feel like a chore.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-8">
      <section className="on-ink relative overflow-hidden rounded-lg px-8 py-14 sm:px-14 sm:py-20">
        <span
          aria-hidden
          className="font-jp pointer-events-none absolute -top-12 -right-8 text-[16rem] leading-none text-white/5 select-none sm:text-[22rem]"
        >
          学
        </span>
        <Stagger className="relative flex max-w-xl flex-col gap-6">
          {[
            <div key="eyebrow" className="flex items-center gap-2.5">
              <span className="bg-accent h-0.5 w-6" aria-hidden />
              <span className="eyebrow text-accent">Free and open</span>
            </div>,
            <h1 key="heading" className="display-1 text-balance">
              Stop forgetting{' '}
              <ruby>
                日本語
                <Reveal as="rt" delay={0.9}>
                  にほんご
                </Reveal>
              </ruby>
              .
            </h1>,
            <p key="body" className="text-muted max-w-md text-[15px] leading-relaxed">
              Every jōyō kanji with real stroke order. Thousands of words. A scheduler that knows
              what you&apos;re about to forget, and shows it to you first.
            </p>,
            <div key="actions" className="flex flex-wrap items-center gap-3">
              <LinkButton href="/sign-in" variant="primary" size="lg">
                Start learning free
              </LinkButton>
              <LinkButton href="/vocab" variant="ghost" size="lg">
                Browse dictionary
              </LinkButton>
            </div>,
          ]}
        </Stagger>
      </section>

      <div className="border-border grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-surface flex flex-col gap-1 px-5 py-5">
            <span className="display-3 text-accent">{stat.value}</span>
            <span className="text-subtle text-xs">{stat.label}</span>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <span className="bg-accent h-0.5 w-6" aria-hidden />
          <span className="eyebrow text-accent">Why NihongoLearn</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="border-border bg-surface rounded-lg border p-5">
              <span
                aria-hidden
                className="font-jp text-accent-soft-foreground bg-accent-soft mb-4 flex h-10 w-10 items-center justify-center rounded-md text-lg"
              >
                {feature.icon}
              </span>
              <h2 className="text-foreground mb-1.5 text-sm font-medium">{feature.title}</h2>
              <p className="text-muted text-[13px] leading-relaxed">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
