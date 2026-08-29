# PROGRESS

Status file, not a log. **Rewrite each section - do not append.**

---

## Current slice

Slice 1 - Auth. Google OAuth complete and verified end-to-end. Email/password
built but blocked on an external SMTP issue - see Open decisions.

## Completed

- `profiles` table migrated to production Supabase, RLS enabled, no policies.
- `src/lib/db/client.ts` - Drizzle + `postgres` driver, `prepare: false` for
  the transaction-mode pooler, HMR-safe singleton.
- `src/lib/auth/{client,server,session}.ts` - Supabase browser/server client
  factories, `getVerifiedUser()`, `ensureProfile()`.
- `src/middleware.ts` - cookie refresh via `getUser()`, redirects signed-out
  visitors off protected routes (not the real auth boundary - each page
  still has to check itself once built).
- **Google OAuth: fully working, verified end-to-end.** Real user in
  Supabase Auth, real `profiles` row created via `ensureProfile`, confirmed
  by checking both tables directly, not just "no errors."
- Email/password: `src/schemas/auth.ts`, `src/lib/rate-limit.ts`
  (`@upstash/ratelimit`, first real use), three route handlers
  (`sign-up`/`sign-in`/`reset-password`, Zod-validated, rate-limited,
  `ApiResponse<T>` contract), `useAuthAction` hook, `SignUpForm`/
  `SignInForm`/`ResetPasswordForm`/`AuthPanel` components, all wired into
  `/sign-in`. Sign-in and reset-password logic is sound. **Sign-up is
  blocked** - see Open decisions.

## Next up

- Slice 2 - Content pipeline: jmdict-simplified + KANJIDIC2 + KanjiVG
  ingestion, sharded JSON artifacts, static kanji/vocab pages. See
  `docs/CONTENT.md`.
- Once SMTP is actually fixed (whenever that happens): re-enable "Confirm
  email," verify a real signup delivers a real confirmation email, and
  resolve the still-open question of whether that confirmation link routes
  through the existing `/auth/callback` (`code` param) or needs a separate
  handler (`token_hash`/`type` params via `verifyOtp`) - untested either way.

## Open decisions

- **Email/password sign-up is effectively unusable right now.** Gmail SMTP
  via Supabase's custom SMTP integration has failed consistently despite:
  confirming the App Password field wasn't empty, confirming Sender
  email/Username/Password all reference the same dedicated account,
  fixing a confirmed bug (Username field literally contained the display
  name "nihongo learn" instead of the email address), confirming custom
  SMTP is toggled on, and confirming Supabase's email rate limit (30/h)
  isn't exhausted. Still 500s. Supabase's own dashboard flags this Gmail
  setup with "designed for sending personal rather than transactional
  email... deliverability may be impacted" - consistent with
  `OPERATIONS.md`'s original caveat that Gmail SMTP "will fail silently at
  the worst possible time." "Confirm email" is toggled **off** so
  sign-up/sign-in/reset-password can at least be exercised without this
  blocking every attempt. Revisit before this app has real users - a
  password-reset flow that silently can't send email is a real problem in
  production, not just a dev inconvenience.
- Prerendered page count for Slice 2 not yet measured. The jouyou + JLPT
  kanji narrowing is a guess at the Vercel Hobby build ceiling. Measure and
  record it in `docs/CONTENT.md`.
- Migrations are manual `workflow_dispatch`. If the friction becomes
  annoying, switching to automatic-on-merge is defensible - but decide
  before there are real users, not after.
- Vitest installed at major **4**, not the major **3** guessed in
  `CLAUDE.md` §3. Still no FSRS/Zod tests to exercise it - re-check at
  Slice 4.
