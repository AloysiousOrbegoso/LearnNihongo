# PROGRESS

Status file, not a log. **Rewrite each section - do not append.**

---

## Current slice

Slice 2 - Content pipeline. Data pipeline complete and verified. Browsing
pages (static kanji/vocab) not yet built.

## Completed

- Slice 0 (scaffolding), Slice 0.5 (shell), Slice 1 (auth - Google OAuth
  verified end-to-end).
- Gmail SMTP fixed (debugged independently). Email/password sign-up
  confirmation delivery is no longer blocked.
- Content pipeline (`scripts/content-build/`): fetches real jmdict-simplified
  (common words), kanjidic2-en, and KanjiVG data; transforms and shards into
  `content/`. Verified reproducible on two independent machines (sandbox +
  this repo's actual Windows environment) with identical output: **22,636**
  JMdict common-word entries, **2,136** jōyō kanji (grade 1-8), **2,136**
  KanjiVG stroke-data entries (0 missing - full coverage of the jōyō set).
  Total `content/` size: ~8MB.
- `/attributions` page + `LICENSE-DATA.md` - EDRDG and KanjiVG acknowledged
  by name, licenses linked, "modified" noted per `CONTENT.md`'s
  requirements. `Footer` component links to it from every page.
- `npm run content:build` script wired up; `.cache/` gitignored.

## Next up

- Confirm "Confirm email" is re-enabled in Supabase (was toggled off as an
  SMTP-debugging workaround) and that a real confirmation link has actually
  been clicked through - resolves whether it routes through the existing
  `/auth/callback` (`code` param) or needs a separate `verifyOtp` handler.
  Still genuinely untested either way.
- **Kanji/vocab browsing pages** - static pages reading from `content/`'s
  manifests and shards at build time (`generateStaticParams`), completing
  Slice 2 per `CLAUDE.md §9` ("content pipeline, then browsing"). This is
  where the real prerendered-page-count number gets measured for the first
  time - currently still blank in `CONTENT.md`.
- Slice 3 - Decks (creation, adding cards with snapshots) once browsing
  exists to link from.

## Open decisions

- Jōyō-only (2,136) vs jōyō-or-JLPT (2,974, via KANJIDIC2's own `jlptLevel`
  field) for kanji scope - currently shipping jōyō-only, closest to
  `CONTENT.md`'s original "~2,200" guess. One-line change in `kanjidic.ts`
  to expand if the measured build size has headroom.
- Local Node is v24.16.0, not the v22 LTS `CLAUDE.md §3` documents - not
  causing any issues so far, but worth reconciling doc vs. reality.
- Migrations are manual `workflow_dispatch`; Vitest at major 4 vs. the
  guessed 3 - both still open from earlier slices, no change.
