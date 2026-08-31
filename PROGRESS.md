# PROGRESS

Status file, not a log. **Rewrite each section - do not append.**

---

## Current slice

Slice 2 - Content pipeline. Complete: data pipeline + browsing pages, both
verified independently on this repo's actual machine, not just a sandbox.

## Completed

- Slice 0 (scaffolding), Slice 0.5 (shell), Slice 1 (auth - Google OAuth
  verified end-to-end, email/password fixed and working).
- Content pipeline (`scripts/content-build/`): real jmdict-simplified,
  kanjidic2-en, KanjiVG data, sharded into `content/`. 22,636 JMdict
  entries, 2,136 jōyō kanji, 2,136 KanjiVG stroke-data entries (0 missing).
  Reproduced identically on two independent machines.
- **Kanji/vocab browsing pages** - bidirectional (Japanese + English)
  search via `/api/search/{vocab,kanji}`, backed by compact server-only
  search indices (never shipped to the browser). Static detail pages for
  every entry (`/vocab/[id]`, `/kanji/[literal]`), `dynamicParams = false`
  per `CONTENT.md`'s "no fallback routes" rule. Kanji detail pages render
  real stroke order via KanjiVG data as React `<path>` elements.
  Functionally verified working end-to-end (search, browse, detail pages)
  on the real dev server.
- **Measured prerendered page count: 24,780** pages, built in 94 seconds
  (sandbox measurement) - recorded in `CONTENT.md`. Build time has large
  headroom against Vercel's 45-minute limit; output file count (~99K) sits
  at a threshold Vercel's docs flag for longer builds, not a documented
  hard failure - a real Vercel deploy is still the only way to fully settle
  this, see Open decisions.
- `/attributions` page + `LICENSE-DATA.md`, `Footer` linking to it site-wide.

## Next up

- Confirm the production `next build` (not just `dev`) reproduces the
  94-second/24,780-page result on this repo's actual machine, if not
  already done.
- A real Vercel deploy, to settle the one thing sandbox testing can't:
  whether Hobby actually accepts a build this size in practice.
- Slice 3 - Decks (creation, adding cards with snapshots from the
  kanji/vocab detail pages now that browsing exists to pull from).

## Open decisions

- Jōyō-only (2,136) vs jōyō-or-JLPT (2,974) kanji scope - still shipping
  jōyō-only. One-line change in `kanjidic.ts` if there's build-size
  headroom to expand later.
- Whether Vercel Hobby genuinely accepts this build size/file count in
  production is unverified - sandbox numbers are promising (large margin
  on build time, source files fine, output-file count at a soft caution
  threshold with no observed slowdown) but not the same as a real deploy.
- Local Node v24.16.0 vs. the v22 LTS `CLAUDE.md §3` documents - still
  unreconciled, still not causing issues.
- Migrations are manual `workflow_dispatch`; Vitest at major 4 vs. the
  guessed 3 - both still open, no change.
- Account customization (username, etc.) explicitly deferred as a later
  "additional feature," not part of the core build order - see
  `FUTURE.md` (kept outside the repo, in the Claude Project).
