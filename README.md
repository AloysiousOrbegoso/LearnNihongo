# Nihongo

Japanese vocabulary and kanji learning app. Bidirectional dictionary
(JMdict/KANJIDIC2) open to everyone, spaced repetition (FSRS) over your own
decks once signed in. Next.js App Router, Supabase auth + Postgres,
Upstash-backed rate limiting.

See `PROGRESS.md` for current status.

## Development

```bash
npm install
cp .env.example .env.local   # fill in real values, never commit .env.local
npm run dev
```

## Scripts

| Script                            | Purpose                                                  |
| --------------------------------- | -------------------------------------------------------- |
| `npm run dev`                     | Local dev server                                         |
| `npm run build`                   | Production build                                         |
| `npm run typecheck`               | `tsc --noEmit`                                           |
| `npm run lint`                    | ESLint                                                   |
| `npm run format` / `format:check` | Prettier                                                 |
| `npm test`                        | Vitest                                                   |
| `npm run db:generate`             | Generate a Drizzle migration from `src/lib/db/schema.ts` |
| `npm run db:check`                | Validate committed migration snapshots                   |
| `npm run db:migrate`              | Apply pending migrations — run manually, never on deploy |
| `npm run content:build`           | Rebuild the JMdict/KANJIDIC2/KanjiVG content shards      |

Migrations are applied to production only via the manually triggered
"Migrate database" GitHub Actions workflow.

## Structure

- `(public)` routes — home, kanji/vocab search and detail pages,
  attributions. No auth required.
- `(app)` routes — decks, review, stats, settings. Gated by `src/proxy.ts`.
- `src/lib/content/` — read-only readers over the sharded JSON in
  `content/`, built by `scripts/content-build/`.
- `src/lib/db/` — Drizzle schema and query functions, one file per
  resource, always scoped by the authenticated user.
- `src/lib/review/scheduler.ts` — the only place `ts-fsrs` is called.
