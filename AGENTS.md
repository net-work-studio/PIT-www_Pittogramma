# AGENTS.md

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
