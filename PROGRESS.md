# PROGRESS

Status file, not a log. **Rewrite each section - do not append.**

---

## Current slice

Slice 0 - Scaffolding. In progress.

## Completed

- Next.js project initialised (App Router, TS strict, `src/` dir, `@/*` alias).
- Full dependency set installed: Tailwind 4, Zod 4, Drizzle 0.x + drizzle-kit,
  `@supabase/ssr` + `supabase-js`, `ts-fsrs`, GSAP + `@gsap/react`,
  `@upstash/ratelimit` + `@upstash/redis`, `kuromoji`, Vitest, Prettier +
  `prettier-plugin-tailwindcss`. Versions filled in below.
- `.gitattributes`, `.gitignore`, ESLint, Prettier, Vitest config.
- `drizzle.config.ts` with `schemaFilter: ['public']`, verified against a
  stub `src/lib/db/schema.ts` (no tables yet - Slice 1 adds `profiles`).
- `.env.example` (empty values).
- Three GitHub Actions workflows: `ci.yml` (typecheck, lint, Prettier check,
  Vitest, Drizzle migration check), `keepalive.yml` (scheduled `SELECT 1`
  against Supabase), `migrate.yml` (manual `workflow_dispatch` running
  `drizzle-kit migrate`).
- `typecheck`, `lint`, `format:check`, `test`, `db:generate`/`db:check`, and
  `next build` all verified green locally before handoff.

## Next up

- Push this branch, verify `ci.yml` actually goes green on GitHub (local
  verification isn't the same as Actions' environment).
- Create Supabase project (**Singapore**) and Upstash Redis (**Singapore**);
  add `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` as both local
  `.env.local` values and GitHub Actions repo secrets (the latter needed by
  `keepalive.yml` and `migrate.yml`).
- Configure Gmail SMTP in Supabase Auth settings (dedicated account, App
  Password, 2FA) — see `docs/OPERATIONS.md`.
- Fill in the §3 version table in `CLAUDE.md` from the versions below.
- Enable GitHub secret scanning with push protection, and Dependabot alerts and
  version updates (repo settings, free, not code).
- Then Slice 0.5 - Shell: layout, nav, typography, `tokens.css`, ruby
  styling, Noto Sans JP subsetting, motion wrappers.

## Open decisions

- Prerendered page count for Slice 2 not yet measured. The jouyou + JLPT
  kanji narrowing is a guess at the Vercel Hobby build ceiling. Measure and
  record it in `docs/CONTENT.md`.
- Migrations are manual `workflow_dispatch`. If the friction becomes
  annoying, switching to automatic-on-merge is defensible - but decide
  before there are real users, not after.
- Vitest installed at major **4**, not the major **3** guessed in
  `CLAUDE.md` §3. No breaking change hit yet (config, `passWithNoTests`, and
  a bare `vitest run` all behaved as expected) - but no FSRS/Zod tests exist
  yet to exercise the assertion API surface. Re-check when Slice 4 (FSRS)
  writes the first real tests.
- `postgres` (or `pg`) driver package is not yet installed - nothing in
  Slice 0 opens a runtime connection. `drizzle-kit generate`/`check` don't
  need one for the postgresql dialect; `src/lib/db/client.ts` in Slice 1
  will need to add one.
