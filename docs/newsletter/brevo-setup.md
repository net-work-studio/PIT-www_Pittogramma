# Brevo Setup Guide

This document supports [NWS-1347](https://linear.app/nws2/issue/NWS-1347/set-up-brevo-workspace-and-base-configuration), [NWS-1351](https://linear.app/nws2/issue/NWS-1351/configure-brevo-automations-and-email-templates), and website signup integration.

## Prerequisites

Create a Brevo workspace before adding credentials to the website. Do **not** commit API keys to git.

## Environment Variables

Add these server-only variables to `.env.local` and Vercel when the account exists:


| Variable                 | Purpose                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `BREVO_API_KEY`          | Brevo API v3 key                                                        |
| `BREVO_WEBSITE_LIST_ID`  | List ID for website signups                                             |
| `BREVO_DOI_TEMPLATE_ID`  | Double opt-in confirmation template ID                                  |
| `BREVO_DOI_REDIRECT_URL` | Post-confirmation redirect URL (e.g. `https://pittogramma.xyz/journal`) |
| `NEXT_PUBLIC_BASE_URL`   | Canonical site URL permitted to submit the browser signup form          |


Optional for migrated contacts (import handled in Brevo UI, not website API):


| Variable                 | Purpose                                |
| ------------------------ | -------------------------------------- |
| `BREVO_MIGRATED_LIST_ID` | List ID for imported Substack contacts |


For the production deployment, set `NEXT_PUBLIC_BASE_URL` to
`https://pittogramma.xyz` in Vercel, then redeploy. This is the site address
the browser sends as the signup form's origin; it is not a Brevo credential.


## Brevo Workspace Checklist

### Account and compliance

- [x] Create Brevo account / workspace
- [x] Configure sender identity (from name and email)
- [ ] Authenticate sending domain (SPF, DKIM)
- [ ] Review GDPR / compliance settings
- [ ] Enable double opt-in for website signups

### Audience structure

Create two lists for launch segmentation:


| List              | Purpose                                                      |
| ----------------- | ------------------------------------------------------------ |
| Website signups   | Contacts from footer and newsletter card forms                |
| Migrated Substack | Contacts imported from Substack export                       |


Create contact attributes in Brevo before enabling the website API:


| Attribute          | Type | Example values                                 |
| ------------------ | ---- | ---------------------------------------------- |
| `SIGNUP_SOURCE`    | Text | `website`                                      |
| `SIGNUP_CONTEXT`   | Text | `footer`, `newsletter_card`                    |
| `MIGRATION_SOURCE` | Text | `substack` (set on import)                     |


### Double opt-in

1. Create a DOI email template in Brevo.
2. Note the template ID for `BREVO_DOI_TEMPLATE_ID`.
3. Set `BREVO_DOI_REDIRECT_URL` to a thank-you or journal landing page.
4. The website calls `POST /v3/contacts/doubleOptinConfirmation` via `/api/newsletter/subscribe`.

### Automations and templates

Minimum operational setup for launch:

- [ ] Welcome / subscription confirmation flow (DOI)
- [ ] Unsubscribe handling verified
- [ ] One reusable branded campaign template
- [ ] Segmentation: migrated Substack vs website signups

## Newsletter Content Workflow

Newsletter sends are driven mostly by latest published articles and projects. Promotional/sponsored content is added as optional manual blocks when a placement exists.

### Preview block fields

Each content block should include:

- Title
- Short excerpt or description
- Featured image URL
- CTA text (default: "Read more")
- Destination link

### Export preview content from Sanity

Generate Brevo-ready preview data:

```bash
bun run scripts/export-newsletter-preview.ts
```

Optional flags:

```bash
bun run scripts/export-newsletter-preview.ts --limit=5
bun run scripts/export-newsletter-preview.ts --output=./tmp/newsletter-preview.json
```

Paste exported blocks into the Brevo campaign template. Promotional blocks remain manual.

## Website Integration Surfaces

The shared signup form appears in:

- Footer (`SIGNUP_CONTEXT=footer`)
- Newsletter card (`SIGNUP_CONTEXT=newsletter_card`)

All website signups use double opt-in and land in the website list.

## Launch Verification

Before retiring Substack from live CTAs:

1. Add all env vars locally and on Vercel.
2. Submit test signups from the footer and newsletter card.
3. Confirm DOI email delivery and list membership in Brevo.
4. Verify contact attributes (`SIGNUP_SOURCE`, `SIGNUP_CONTEXT`).
5. Test unsubscribe behavior.
6. Import migrated Substack contacts into the migrated list with `MIGRATION_SOURCE=substack`.
7. Send a test campaign using the branded template.

See also [substack-migration.md](./substack-migration.md) for URL mapping and subscriber import steps.
