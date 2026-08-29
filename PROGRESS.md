# PROGRESS

Status file, not a log. **Rewrite each section - do not append.**

---

## Current slice

Slice 0 - Scaffolding. Complete.

## Completed

- Next.js project initialised (App Router, TS strict, `src/` dir, `@/*` alias).
- Full dependency set installed and pinned in `package.json` (Next 16,
  Tailwind 4, Zod 4, Drizzle 0.x, `@supabase/ssr` + `supabase-js`, `ts-fsrs`,
  GSAP + `@gsap/react`, `@upstash/ratelimit` + `@upstash/redis`, `kuromoji`,
  Vitest, Prettier + `prettier-plugin-tailwindcss`).
- `.gitattributes`, `.gitignore`, ESLint, Prettier, Vitest config.
- `drizzle.config.ts` with `schemaFilter: ['public']`; stub `schema.ts`
  (no tables yet - Slice 1 adds `profiles`).
- `.env.example` (empty values) and a filled, git-ignored `.env.local`.
- `dependabot.yml` (npm + github-actions, weekly, minor/patch grouped).
- GitHub secret scanning + push protection, Dependabot alerts enabled.
- `typecheck`, `lint`, `format:check`, `test`, `db:generate`/`db:check`, and
  `build` all green, both locally and in `ci.yml`.
- Supabase project live, **Singapore** region, pooled (transaction, :6543)
  connection string confirmed.
- Upstash Redis live, Singapore region.
- Gmail SMTP configured in Supabase Auth: dedicated Google account (not
  personal), 2FA + App Password, custom sender name/address.
- `DATABASE_URL` set as a GitHub Actions secret; `keepalive.yml` manually
  triggered and confirmed green - the connection string works end-to-end.

## Next up

- Fill in the §3 version table in `CLAUDE.md` (values already known - see
  `package.json` for the installed majors).
- Slice 0.5 - Shell: layout, nav, typography, `tokens.css`, ruby styling,
  Noto Sans JP subsetting, motion wrappers. Needs a couple of design
  decisions first (palette/brand direction, pre-auth vs post-auth nav).
- Then Slice 1 - Auth: Google OAuth first, then email/password; `profiles`
  upsert on first authenticated request. First real use of `DATABASE_URL`
  and `SUPABASE_SERVICE_ROLE_KEY` in application code.

## Open decisions

- Prerendered page count for Slice 2 not yet measured. The jouyou + JLPT
  kanji narrowing is a guess at the Vercel Hobby build ceiling. Measure and
  record it in `docs/CONTENT.md`.
- Migrations are manual `workflow_dispatch`. If the friction becomes
  annoying, switching to automatic-on-merge is defensible - but decide
  before there are real users, not after.
- Vitest installed at major **4**, not the major **3** guessed in
  `CLAUDE.md` §3. No breaking change hit yet - but no FSRS/Zod tests exist
  yet to exercise the assertion API surface. Re-check when Slice 4 (FSRS)
  writes the first real tests.
- `postgres` (or `pg`) driver package is not yet installed - nothing in
  Slice 0 opens a runtime connection. Slice 1's `src/lib/db/client.ts` will
  need to add one.
