# PROGRESS

Status file, not a log. **Rewrite each section - do not append.**

---

## Current slice

Core build order (0 through 5) is done. Extended with a signed-in dashboard
and all three planned practice games: Kana Practice, Sentence Builder, and
Daily Trivia.

## Completed

- Slice 0/0.5/1 - scaffolding, shell, auth (Google OAuth + email/password,
  both verified working).
- Content pipeline (`scripts/content-build/`): real jmdict-simplified,
  kanjidic2-en, KanjiVG data, sharded into `content/`. 22,636 JMdict
  entries, 2,136 jōyō kanji, 2,136 KanjiVG stroke-data entries.
- Bidirectional (Japanese + English) search via `/api/search/{vocab,kanji}`,
  static detail pages for every entry (`dynamicParams = false`). Kanji
  pages render real stroke order from KanjiVG data. Kanji detail params are
  explicitly `decodeURIComponent`-ed before lookup - Next.js hands the page
  component the percent-encoded route segment at request time even though
  `generateStaticParams()` returns the raw character, which previously made
  every single kanji page 404 in production.
- **Decks** - create/delete decks, add cards to a deck directly from a
  kanji/vocab detail page (deck context carried via `?deckId=&deckName=`
  query params and a client-side banner, so the dictionary pages stay
  statically generated). Adding a card snapshots the word/reading/gloss at
  add time so later dictionary edits don't retroactively change a saved
  card.
- **Review loop** - `src/lib/review/scheduler.ts` wraps `ts-fsrs` behind an
  explicit `now` parameter (unit-tested, no wall-clock dependence).
  `/api/review/queue` and `/api/review/answer` are rate-limited and
  re-check deck ownership on every read/write. `/review` is a
  keyboard-first session (space/enter to flip, 1-4 to rate) that can be
  scoped to one deck or pull from all of them.
- **Stats** - `/stats` shows due count, reviews today, streak (computed in
  the user's own timezone, set on `/settings`), 30-day retention, a 14-day
  review history bar chart, and a breakdown of cards by FSRS state.
- **Home dashboard** - signed-in nav collapsed to Home/Decks/Stats/Settings;
  `/home` is a card-based hub linking to Review, Kana Practice, Sentence
  Builder, Daily Trivia, Decks, and dictionary browsing.
- **Kana practice** (hiragana/katakana, 71 characters each - gojūon +
  dakuten/handakuten): `/kana` shows per-script mastery %; `/kana/practice`
  is free flashcard drilling that never touches progress; `/kana/exam`
  is a multiple-choice exam (10/25/46 characters, weighted toward
  characters not yet mastered) that's the _only_ thing that updates
  progress. A character is "mastered" at a 3-correct-in-a-row streak and
  un-masters on a later wrong answer. Grading happens server-side
  (`/api/kana/exam/submit`) against the static kana dataset, never trusting
  client-submitted correctness.
- **Sentence Builder** - locked until both hiragana and katakana are fully
  mastered. Three progressively-unlocking tiers (simple -> compound ->
  complex), each unlocking once every point in the previous tier is
  mastered. Simple-tier sentences are slot-fill: a fixed template
  (`{flavor}は{choice}です。`, `{choice}が好きです。`) with only the
  "choice" slot varying, drawing from a curated bank of 251 hand-vetted
  beginner words (139 nouns, 56 adjectives, 56 verbs -
  `src/lib/content/beginnerVocab.ts`) rather than the full ~22k-entry
  dictionary, so exercises stay grammatically correct and vocabulary stays
  beginner-appropriate. Grading re-derives correctness server-side from
  the word's curated category, never trusting client-submitted
  correctness. Compound/complex tiers are still a curated, hand-written
  bank (3 exercises each for the ten grammar connectors
  て/し/けど/から/ので/とき/ば/たら/なら/のに), since those tiers test
  connector/conjugation correctness rather than vocabulary.
  `/sentences/[tier]/practice` shows generated slot-fill examples (simple)
  or the connector lessons plus free drilling (compound/complex);
  `/sentences/[tier]/exam` quizzes a fresh set each time (multiple-choice
  word-in-slot for simple, "which sentence matches this meaning" for
  compound/complex) and is the only thing that updates mastery.
- **Daily Trivia** - a showcase card, not a graded quiz: `/trivia` picks a
  deterministic word-of-the-day (date hashed to an index into the JMdict
  pool, same word for every user on a given day), with "Add to deck"
  (reusing the existing `AddToDeckButton`) and an ungraded "Write a
  sentence with it" free-text prompt - deliberately not auto-graded or
  auto-populated with a generated example sentence, for the same
  correctness-risk reason as Sentence Builder above.
- `/attributions` page + `LICENSE-DATA.md`, linked from the footer
  site-wide.
- Migrations are tracked in `drizzle/` as five ordered files (profiles;
  decks + cards; review_logs; kana_mastery + kana_exams; sentence_mastery +
  sentence_exams), each enabling row-level security with no policies,
  applied manually via the "Migrate database" GitHub Actions workflow.
- Full check suite (typecheck, lint, format, test, build) passes clean.
  Production build measured at 24,805 static pages in ~75 seconds.

## Next up

- A real Vercel deploy, to confirm Hobby accepts this build size in
  practice (sandbox numbers have comfortable headroom on build time; output
  file count sits at a soft caution threshold in Vercel's own docs, not a
  documented hard failure).
- Expand Sentence Builder's compound/complex content bank (currently 3
  examples per connector) if the exercise pool starts feeling repetitive
  in practice. The simple tier's curated vocabulary bank (251 words) can
  also grow over time.
- Account customization (display name, avatar) - still an optional
  later addition, not part of the core build order.
- Consider widening kanji coverage from jōyō-only (2,136) to
  jōyō-or-JLPT (2,974) if build-size headroom allows - one-line change in
  `kanjidic.ts`.

## Open decisions

- Jōyō-only vs. jōyō-or-JLPT kanji scope - still shipping jōyō-only.
- Whether Vercel Hobby genuinely accepts this build size/file count in
  production is unverified outside the sandbox.
- Vitest is pinned at major 4; no issues observed.
