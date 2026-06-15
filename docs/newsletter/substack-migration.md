# Substack Migration Guide

This document supports [NWS-1122](https://linear.app/nws2/issue/NWS-1122/add-brevo-integration-for-newsletter) and [NWS-1346](https://linear.app/nws2/issue/NWS-1346/audit-substack-setup-and-migration-constraints).

## Goal

Fully replace Substack as the live newsletter destination. Website CTAs and footer signup should point to Brevo-managed signup. Legacy Substack article URLs should resolve to the corresponding migrated article on Pittogramma where a mapping exists.

## Inventory Checklist

Before importing contacts or retiring Substack links, collect:

| Item | Where to find it | Notes |
|------|------------------|-------|
| Subscriber export | Substack Settings → Audience → Export | CSV with email, subscription date, and status |
| Publication URLs | Substack dashboard | Format: `https://{publication}.substack.com/p/{post-slug}` |
| Signup entry points | Substack embeds, website footer, article CTAs | Currently wired via `siteSettings.substackUrl` in Sanity |
| Tags / segments | Substack audience settings | Preserve where feasible in Brevo lists or attributes |
| Consent fields | Export metadata | Required for GDPR-compliant import |

## Subscriber Export Fields

When exporting from Substack, expect at minimum:

- `email` — required for Brevo import
- `created_at` or subscription date — useful for segmentation
- `subscription_status` — filter to active subscribers only
- Any tag or segment columns Substack provides

### Import mapping to Brevo

| Substack field | Brevo target | Launch segment |
|----------------|--------------|----------------|
| Email | Contact email | — |
| Active subscriber | List membership | Migrated Substack list |
| Tags (if any) | Contact attributes or list tags | Preserve where feasible |
| — | `MIGRATION_SOURCE` attribute | Set to `substack` for all imported contacts |

Day-one segmentation stays simple:

- **Migrated Substack contacts** — imported list with `MIGRATION_SOURCE=substack`
- **Website signups** — website list with `SIGNUP_SOURCE=website` via the signup API

Origin-page tracking for website signups is optional and can be deferred.

## Legacy URL Mapping

Substack post URLs typically look like:

```
https://{publication}.substack.com/p/{post-slug}
```

Migrated articles live at:

```
https://pittogramma.xyz/journal/{site-slug}
```

Maintain mappings in [`data/substack-url-map.json`](../../data/substack-url-map.json):

```json
{
  "mappings": [
    {
      "source": "/p/example-substack-slug",
      "destination": "/journal/example-site-slug",
      "note": "Optional editorial note"
    }
  ],
  "fallbackDestination": "/journal"
}
```

Validate mappings before launch:

```bash
bun run scripts/validate-substack-url-map.ts
```

## Redirect Constraints

**Important:** Next.js redirects in `next.config.ts` only apply to requests that hit `pittogramma.xyz`. They do **not** redirect traffic still going to `*.substack.com`.

| Traffic source | Action |
|----------------|--------|
| Requests to `pittogramma.xyz/p/...` (custom domain) | Add redirects from `data/substack-url-map.json` |
| Requests to `*.substack.com/p/...` | Update links in Substack posts manually, or configure Substack custom-domain redirects if available |
| Unmapped legacy URLs | Redirect to `fallbackDestination` (`/journal`) |

## Risks and Gaps

- No `legacySubstackUrl` field exists on journal documents yet — mapping lives in JSON until editorial cleanup is done.
- Substack archive pages may remain accessible short term; website CTAs should switch to Brevo signup as soon as integration is live.
- Privacy policy link in footer currently points to `/terms-of-service` — confirm consent copy before enabling signup.
- Designer profile Substack links (`socialLinks.platform=substack`) are out of scope for this migration.

## Manual Follow-up After Brevo Account Exists

1. Export and clean Substack subscriber list ([NWS-1348](https://linear.app/nws2/issue/NWS-1348/migrate-subscribers-into-brevo-with-segments)).
2. Import contacts into Brevo migrated list with `MIGRATION_SOURCE=substack`.
3. Complete URL mapping in `data/substack-url-map.json` and re-run validation.
4. Update any remaining CMS CTAs that still link to Substack manually.
5. Retire Substack from live website CTAs once end-to-end validation passes ([NWS-1352](https://linear.app/nws2/issue/NWS-1352/validate-end-to-end-newsletter-launch-flow)).
