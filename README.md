[![Sanity production backup](https://github.com/net-work-studio/PIT-www_Pittogramma/actions/workflows/sanity-production-backup.yml/badge.svg)](https://github.com/net-work-studio/PIT-www_Pittogramma/actions/workflows/sanity-production-backup.yml)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Production deployments

Vercel production builds run `sanity:migrate-cta-images` before `next build`.
The migration copies legacy CTA images to `imgLight` before the current CTA
projection is deployed. Preview and local builds skip this production migration.

Set `SANITY_AUTH_TOKEN` in the Vercel Production environment to a Sanity token
with write access. If the migration fails, the build stops before deployment.
The migration is idempotent, so later production builds can run it safely.

## Sanity production backups

Run `bun run sanity:backup` with a read-only `SANITY_AUTH_TOKEN` to create a
full `jfvmcjyl` / `production` export, including assets, in `./backups`. The
command writes a SHA-256 manifest beside the archive. Set
`SANITY_BACKUP_OUTPUT_DIR` to write elsewhere.

GitHub Actions runs the same export every Monday at 02:17 UTC on Blacksmith,
uploads it to Swiss Backup, checks that the uploaded manifest round-trips, and
keeps weekly archives for 90 days plus monthly archives for 12 months. Run the
workflow manually for an on-demand backup.
