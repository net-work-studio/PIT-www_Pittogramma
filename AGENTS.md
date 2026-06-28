# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 16 (App Router, React 19) app named `pittogramma-web` backed by Sanity as the CMS. The Sanity Studio is **embedded** in the same app at the `/admin` route — there is **one** dev server (`bun dev`) that serves both the public frontend (route group `(frontend)`) and the Studio. There is no separate Studio server.

- **Package manager is Bun** (pinned `bun@1.3.14`). Bun is installed at `~/.bun/bin` and is on `PATH` via `~/.bashrc`. Always use `bun` / `bunx`, not npm/yarn/pnpm. Standard scripts live in `package.json` (`dev`, `build`, `start`, `typecheck`, `check`, `fix`, `typegen`).
- **Required runtime env vars** (no `.env*` file is committed): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN`. `src/sanity/env.ts` and `src/sanity/lib/token.ts` throw at import if these are missing. Without a **real hosted Sanity project**, frontend pages return HTTP 500 (`Dataset not found`) and the Studio cannot authenticate — these are not available offline, so set them as Cloud Agent secrets before running the app.
- **`bun dev` auto-runs `predev` → `bun run typegen`** (`sanity schema extract` + `sanity typegen generate`). Typegen is **fully local**: it works without real Sanity credentials or network (a dummy `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` is enough). Generated output (`src/sanity/types.ts`, `src/sanity/extract.json`) is committed.
- **Lint**: `bun run check` (`ultracite check`); autofix with `bun run fix`. The `git commit` hook in `.claude/hooks.json` runs `bunx ultracite fix && git add -A` before committing, so `bun run check` may report pre-existing formatting issues that the commit hook would auto-fix.
- **Typecheck**: `bun run typecheck` (`tsc --noEmit`).
- **Use `next-cacheComponents`**: `next.config.ts` sets `cacheComponents: true`; data fetching goes through `next-sanity` `sanityFetch`/`<SanityLive>`. `/editions` and `/editions/:slug` are temporarily redirected to `/`.
- Optional/feature-specific env vars (not needed to boot): `SANITY_REVALIDATE_SECRET`, `NEXT_SITE_URL` (Sanity Function cache invalidation), `GOOGLE_BOOKS_API_KEY`, `NEXT_PUBLIC_BASE_URL`. Feature flags in `src/lib/feature-flags.ts` default to enabled.
