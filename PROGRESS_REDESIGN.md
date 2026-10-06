# Redesign progress

Scope: visual redesign per chat session. No files deleted or renamed, per
CLAUDE.md. This note is additive to the existing PROGRESS.md and describes
only what this pass touched.

## Shipped and verified (typecheck, lint, vitest, prettier all clean)

**Foundation**
- `src/styles/tokens.css` -- new ink/vermillion palette, sharpened radius
  scale (12px card corners down to 8px, pill buttons down to 6px default),
  mode-invariant `--ink-*` scale for permanently-dark sections.
- `src/styles/globals.css` -- `.on-ink` inversion utility, `.display-1/2/3`
  and `.eyebrow` type scale, flattened card shadow, focus ring, selection
  color. `btn-chunky` kept as opt-in, no longer the default.
- `src/app/layout.tsx` -- added Instrument Serif as a second, single-weight
  Latin-only display font alongside the existing Noto Sans JP. Real
  metadata/description copy instead of placeholder text.

**Primitives** (same public props as before -- every existing call site
across all 20 pages still typechecks unmodified)
- `Button.tsx` / `LinkButton` -- sharp by default, `chunky` is now an opt-in
  boolean prop rather than baked in. Added `size="lg"`.
- `Card.tsx` / `LinkCard` -- 8px corners, hover state is a border-color
  change instead of translate + shadow bloom.
- `Badge.tsx` -- tones now use the new `*-soft` / `*-soft-foreground` token
  pairs so contrast holds in dark mode.
- `Input.tsx` -- proper focus ring using `--accent-soft`.
- `ProgressBar.tsx` -- 4px track (was 12px), sharp ends.

**Chrome**
- `Nav.tsx` -- wider container (`max-w-6xl`), sharper active-link pill.
- `Footer.tsx` -- matched container width.
- `AppChrome.tsx` (new file) -- client wrapper that hides nav/footer on
  `/review`, `/kana/exam`, and `/sentences/[tier]/exam` so those sessions
  get the full viewport. Matches by pathname rather than a route group,
  since moving files wasn't allowed.
- `app/(app)/layout.tsx` -- now delegates to `AppChrome`.
- `app/(public)/layout.tsx` -- widened to `max-w-6xl`; narrow-column pages
  are expected to apply their own inner wrapper (sign-in already does).

**Pages fully rebuilt**
- `/` (landing) -- ink hero, real dataset counts pulled from
  `jmdictReader`/`kanjidicReader` at build time (never hardcoded), feature
  grid with icon glyphs instead of emoji.
- `/sign-in` -- split screen: ink brand panel + existing `AuthPanel` in a
  restyled right column. `AuthPanel` and its child forms were not modified.
- `/home` (dashboard) -- one dominant due-count panel, a 3-up practice grid,
  a quiet nav row. Uses only queries the page already fetched; did not add
  a streak call (see Not done, below).
- `/decks` -- `NewDeckDisclosure.tsx` (new file) collapses `CreateDeckForm`
  behind a "New deck" button instead of always showing it; deck rows show
  name, count, and one primary action each.

## Not done -- still mock-only, unstyled beyond inherited tokens

Every page below still renders with the old layout/spacing, but already
picks up the new colors, radii, and primitive styling for free, since
`Button`/`Card`/`Badge`/`ProgressBar`/`Nav`/`Footer` changed globally.

- `/kanji`, `/kanji/[literal]` -- mock adds a browsable grid and a
  kanji-to-vocabulary reverse index; the reverse index needs a new shard
  from `scripts/content-build/`, which is a content-pipeline change, not
  a frontend one.
- `/vocab`, `/vocab/[id]` -- planned to mirror the kanji pair; not built.
- `/decks/[id]` -- mock redesigns the card list into a scannable row
  format; needs a stacked layout under the sm breakpoint, not yet designed.
- `/review` -- mock removes chrome (done, via AppChrome) but the actual
  card/grading markup inside `ReviewSession.tsx` is untouched.
- `/stats` -- mock promotes retention to a headline metric and turns the
  14-day list into a bar chart; not built.
- `/settings` -- mock groups avatar + name into one identity card;
  not built.
- `/kana`, `/kana/practice`, `/kana/exam` -- mock adds mastery rings and
  a shared session shell; not built.
- `/sentences`, `/sentences/[tier]/practice`, `/sentences/[tier]/exam` --
  same shared shell as kana; not built.
- `/trivia` -- mock uses an ink showcase card; not built.
- `/attributions` -- intentionally left plain by design, just needs the
  new type scale applied.

## Known gaps and decisions still open

- Home dashboard doesn't show a streak. Adding one means either calling
  the full `getStats` (wasteful -- it also computes 30-day retention and
  history) or splitting a lightweight streak query out of
  `lib/db/queries/stats.ts`. Left as a follow-up rather than guessed at.
- `/decks/[id]`'s planned mature/learning/new segmented bar needs
  `getUserDecksWithCounts` to return a state breakdown (a `GROUP BY
  cards.state`). Not added.
- The kanji-detail "words using this kanji" section needs a build-time
  reverse index (kanji literal -> JMdict entry ids) added to
  `scripts/content-build/`. This adds static output and interacts with
  the open Vercel Hobby file-count question already in PROGRESS.md --
  flagging before anyone builds it, not deciding it here.
- No mobile nav menu was added to `Nav.tsx`. On narrow widths the current
  nav items will wrap or overflow; untouched from before this pass in that
  specific respect.
- Google Fonts network fetch (`Instrument_Serif`, `Noto_Sans_JP`) could
  not be verified end-to-end in the sandbox this was built in --
  `fonts.googleapis.com` isn't reachable from there. Confirmed the
  identical failure occurs on unmodified `main`, so it isn't a regression.
  `npx tsc --noEmit` passed, which does validate the font import name and
  every page against the new component APIs. Run `npm run build` on your
  machine to get the real, network-backed confirmation.

## Verified before packaging

- `npx tsc --noEmit` -- clean
- `npx eslint .` -- clean
- `npx vitest run` -- 49/49 tests passing, unchanged
- `npx prettier --check .` -- clean
