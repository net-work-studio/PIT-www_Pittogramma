# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pittogramma is a design-focused content platform built with Next.js 16 and Sanity CMS. It showcases projects, interviews, designers, and design resources (bibliography, bookshops, glossaries, institutes, type foundries, web sources).

## Commands

```bash
bun dev          # Development server (runs typegen first)
bun build        # Production build (runs typegen first)
bun typecheck    # TypeScript type checking
bun run check    # Biome lint check (via Ultracite)
bun run fix      # Biome auto-fix
bun run typegen  # Regenerate Sanity types (schema extract + typegen)
```

## Architecture

### Tech Stack
- **Next.js 16** with App Router and React 19
- **Sanity 5** as headless CMS with live preview
- **TypeScript** in strict mode
- **Biome** for linting/formatting (Ultracite config)
- **Tailwind CSS 4** with OKLCH color system
- **shadcn/ui** components (Radix primitives)

### Directory Structure

```
src/
├── app/
│   ├── (frontend)/           # Public routes with route groups:
│   │   ├── (features)/       # projects, interviews, designers, billboard
│   │   ├── (resources)/      # bibliography, bookshops, glossary, etc.
│   │   ├── (support)/        # donate, submit, contribute
│   │   └── (info)/           # about, editions
│   ├── admin/[[...tool]]/    # Sanity Studio at /admin
│   └── api/                  # API routes (books, websites, draft-mode)
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── cards/                # BaseCard, CTACard
│   ├── navigation/           # Desktop, mobile, resources nav
│   ├── modules/              # Feature-specific modules
│   └── shared/               # PageHeader, Footer
├── sanity/
│   ├── schemaTypes/
│   │   ├── documents/        # 25 document types
│   │   ├── objects/          # 12 object types (media, SEO, etc.)
│   │   └── singletons/       # Site settings, page configs
│   ├── lib/
│   │   ├── queries.ts        # All GROQ queries
│   │   ├── client.ts         # Sanity client
│   │   └── live.ts           # Live content queries
│   └── types.ts              # Generated types (DO NOT EDIT)
└── lib/
    ├── seo/                  # SEO utilities
    └── utils.ts              # cn() classname helper
```

### Data Flow

1. **Content** lives in Sanity CMS
2. **GROQ queries** in `sanity/lib/queries.ts` fetch data
3. **Server components** call `sanityFetch()` for live data
4. **Types** are auto-generated from schema via `bun run typegen`
5. **Draft mode** enables preview of unpublished content

### Key Patterns

- **Server components by default** - pages use async data fetching
- **Generated types** - Sanity types in `sanity/types.ts` are auto-generated; regenerate with `bun run typegen` after schema changes
- **GROQ fragments** - Reusable query fragments like `CTA_FIELDS` and `SEO_FIELDS` in queries.ts
- **Media blocks** - Multiple gallery layouts (side-by-side, grid, single) defined as Sanity objects
- **SEO module** - Comprehensive SEO with OpenGraph and X Card support per document

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID   # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET      # Usually "production"
NEXT_PUBLIC_SITE_URL            # Base URL
SANITY_API_READ_TOKEN           # For draft/preview content
GOOGLE_BOOKS_API_KEY            # For ISBN book data (optional)
```

## Sanity Schema Conventions

- **Document types**: project, interview, designer, journal, event, edition, etc.
- **Singletons**: siteSettings, homePage, projectsPage, interviewsPage, designersPage
- **Field groups**: metadata, content, seo (organized in Sanity Studio)
- **Media handling**: `imageWithMetadata` object includes alt text and caption

## TypeScript Conventions

- **Prefer `interface` over `type`** for object shapes (aligns with Biome's `useConsistentTypeDefinitions` rule)
- **Explicit type annotations** in map/filter callbacks when working with Sanity query results
- **Avoid non-null assertions** (`!`) - use optional chaining with fallbacks (`??`) instead

## Linting

Uses Biome via Ultracite with these project-specific rules:
- `noExplicitAny`: warn (not error)
- `noConsole`: warn
- `noMagicNumbers`: off
- `noNamespaceImport`: off (Sanity uses namespace imports)
- `noNonNullAssertion`: error (use optional chaining instead)

Excluded from linting: `sanity/types.ts`, `.next/`, `admin/`
