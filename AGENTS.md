# AGENTS.md

## Agent skills

### Issue tracker

Issues are tracked in Linear under the Work team and PIT-www_Pittogramma project. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository. See `docs/agents/domain.md`.

## Cursor Cloud specific instructions

Pittogramma (`pittogramma-web`) is a single Next.js 16 (App Router) app with an embedded Sanity Studio. It is not a multi-app monorepo.

### Services / how to run
- Dev server: `bun dev` (serves the public site at http://localhost:3000 and the Sanity Studio at http://localhost:3000/admin). `predev` runs `bun run typegen` first; typegen is fully local (extracts from the committed schema, no network/auth needed).
- Lint/format: `bun run check` / `bun run fix` (Biome + Ultracite). Note: `bun run check` currently reports pre-existing lint errors in committed source — they are not caused by environment setup, so don't treat a non-zero exit here as a setup failure.
- Type check: `bun run typecheck` (`tsc --noEmit`).
- Tests: `bun test` (Bun's built-in runner). There is intentionally no `test` npm script.

### Environment variables (non-obvious)
- The app hard-throws at import time without `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN`. These are set in a gitignored `.env.local` (persisted in the VM snapshot). The public values are committed in the repo: project id `jfvmcjyl`, dataset `production`.
- The `production` dataset is publicly readable, so all published content renders without a valid token. `SANITY_API_READ_TOKEN` in `.env.local` is a placeholder — published-content browsing works with it, but draft mode / Presentation preview and authoring writes in `/admin` require a real Sanity read token plus an interactive Sanity login in the browser.

### Tooling
- Package manager is Bun (pinned `bun@1.3.14`). Bun is installed at `~/.bun` and its PATH export lives in `~/.bashrc`.
- `bunfig.toml` sets `minimumReleaseAge` (3 days) for installs; `bun install` against the committed `bun.lock` is unaffected.
This is a single Next.js 16 (App Router, React 19) app named `pittogramma-web` backed by Sanity as the CMS. The Sanity Studio is **embedded** in the same app at the `/admin` route — there is **one** dev server (`bun dev`) that serves both the public frontend (route group `(frontend)`) and the Studio. There is no separate Studio server.

- **Package manager is Bun** (pinned `bun@1.3.14`). Bun is installed at `~/.bun/bin` and is on `PATH` via `~/.bashrc`. Always use `bun` / `bunx`, not npm/yarn/pnpm. Standard scripts live in `package.json` (`dev`, `build`, `start`, `typecheck`, `check`, `fix`, `typegen`).
- **Required runtime env vars** (no `.env*` file is committed): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN`. `src/sanity/env.ts` and `src/sanity/lib/token.ts` throw at import if these are missing. Without a **real hosted Sanity project**, frontend pages return HTTP 500 (`Dataset not found`) and the Studio cannot authenticate — these are not available offline, so set them as Cloud Agent secrets before running the app.
- **`bun dev` auto-runs `predev` → `bun run typegen`** (`sanity schema extract` + `sanity typegen generate`). Typegen is **fully local**: it works without real Sanity credentials or network (a dummy `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` is enough). Generated output (`src/sanity/types.ts`, `src/sanity/extract.json`) is committed.
- **Lint**: `bun run check` (`ultracite check`); autofix with `bun run fix`. The `git commit` hook in `.claude/hooks.json` runs `bunx ultracite fix && git add -A` before committing, so `bun run check` may report pre-existing formatting issues that the commit hook would auto-fix.
- **Typecheck**: `bun run typecheck` (`tsc --noEmit`).
- **Use `next-cacheComponents`**: `next.config.ts` sets `cacheComponents: true`; data fetching goes through `next-sanity` `sanityFetch`/`<SanityLive>`. `/editions` and `/editions/:slug` are temporarily redirected to `/`.
- Optional/feature-specific env vars (not needed to boot): `SANITY_REVALIDATE_SECRET`, `NEXT_SITE_URL` (Sanity Function cache invalidation), `GOOGLE_BOOKS_API_KEY`, `NEXT_PUBLIC_BASE_URL`. Feature flags in `src/lib/feature-flags.ts` default to enabled.
