# PROGRESS

Status file, not a log. **Rewrite each section - do not append.**

---

## Current slice

Slice 5 complete. Core build order (0 through 5) is done: scaffolding,
shell, auth, content pipeline + browsing, decks, review loop, stats.

## Completed

- Slice 0/0.5/1 - scaffolding, shell, auth (Google OAuth + email/password,
  both verified working).
- Content pipeline (`scripts/content-build/`): real jmdict-simplified,
  kanjidic2-en, KanjiVG data, sharded into `content/`. 22,636 JMdict
  entries, 2,136 jōyō kanji, 2,136 KanjiVG stroke-data entries.
- Bidirectional (Japanese + English) search via `/api/search/{vocab,kanji}`,
  static detail pages for every entry (`dynamicParams = false`). Kanji
  pages render real stroke order from KanjiVG data.
- **Decks** - create/delete decks, add cards to a deck directly from a
  kanji/vocab detail page (deck context carried via `?deckId=&deckName=`
  query params and a client-side banner, so the dictionary pages stay
  statically generated). Adding a card snapshots the word/reading/gloss at
  add time so later dictionary edits don't retroactively change a saved
  card.
- **Review loop** - `src/lib/review/scheduler.ts` wraps `ts-fsrs` behind an
  explicit `now` parameter (unit-tested in `scheduler.test.ts`, no wall-clock
  dependence). `/api/review/queue` and `/api/review/answer` are rate-limited
  and re-check deck ownership on every read/write. `/review` is a
  keyboard-first session (space/enter to flip, 1-4 to rate) that can be
  scoped to one deck or pull from all of them.
- **Stats** - `/stats` shows due count, reviews today, streak (computed in
  the user's own timezone, set on `/settings`), 30-day retention, a 14-day
  review history bar chart, and a breakdown of cards by FSRS state.
- `/attributions` page + `LICENSE-DATA.md`, linked from the footer
  site-wide.
- Migrations are tracked in `drizzle/` as three ordered files (profiles;
  decks + cards; review_logs), each enabling row-level security with no
  policies, applied manually via the "Migrate database" GitHub Actions
  workflow.
- Full check suite (typecheck, lint, format, test, build) passes clean.
  Production build measured at 24,795 static pages in ~2 minutes.

## Next up

- A real Vercel deploy, to confirm Hobby accepts this build size in
  practice (sandbox numbers have comfortable headroom on build time; output
  file count sits at a soft caution threshold in Vercel's own docs, not a
  documented hard failure).
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
