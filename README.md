# Nihongo

Japanese vocabulary and kanji learning app. Spaced repetition (FSRS) over
JMdict/KANJIDIC2 content, Next.js App Router, Supabase auth + Postgres,
Upstash-backed rate limiting.

See `CLAUDE.md` for the rules that shape this codebase, `PROGRESS.md` for
current status, and `docs/` for operations and content-pipeline reference
material.

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

Migrations are applied to production only via the manually triggered
"Migrate database" GitHub Actions workflow. See `docs/OPERATIONS.md`.
