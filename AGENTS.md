# AGENTS.md

## Agent skills

### Issue tracker

Issues are tracked in Linear under the Work team and PIT-www_Pittogramma project. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository. See `docs/agents/domain.md`.

## Project workflow

Pittogramma (`pittogramma-web`) is one Next.js 16 App Router app with an embedded Sanity Studio at `/admin`.

- Use Bun only. The pinned version is `bun@1.3.14`.
- `bun dev` serves the site at http://localhost:3000 and Studio at http://localhost:3000/admin. It runs `bun run typegen` first.
- Required runtime variables are `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN`. The app throws at import time without them. A real Sanity token and interactive Sanity login are required for draft preview and Studio writes.
- Run `bun run typecheck` for TypeScript checks and `bun test` for tests. There is no `test` package script.
- At the end of every task, run `bun run check`. Fix every reported lint error and warning. Use `bun run fix` for safe automatic fixes, then run the check again.
- Next.js Cache Components are enabled. Fetch Sanity data through `next-sanity` `sanityFetch` and `<SanityLive>`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
