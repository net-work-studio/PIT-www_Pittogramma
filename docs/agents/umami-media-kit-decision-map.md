# Umami, media kit, and reach decision map

## Destination

Measure Pittogramma's audience with Umami, prepare defensible direct-sponsorship reporting, and improve qualified editorial visits without compromising the reading experience.

## Decisions so far

- Use Umami rather than Plausible.
- Run the existing self-hosted Umami instance.
- Launch with direct, first-party sponsored placements only.
- Use a dated private PDF for the first media kit, supported by a private Umami report for qualified partners.
- Treat a sponsored placement as separate from a Contributor. A pageview is not an ad impression.
- Keep analytics event properties free of personal data.

## Not yet specified

- The placement formats, pricing, availability, and viewability rule.

## #1: Choose the Umami deployment

Type: Discuss

### Question

Will Pittogramma use Umami Cloud or self-host Umami with PostgreSQL? This fixes the tracker URL, ownership of backups and updates, data-location documentation, and the deployment work.

### Answer

Resolved. Use the existing self-hosted Umami instance. The implementation must use its HTTPS tracker endpoint and document the owner of database backups, upgrades, and access control.

## #2: Define the commercial measurement boundary

Type: Discuss

### Question

Will launch sponsorships be first-party, direct placements only, or will the site include a third-party ad network? This determines consent, reporting ownership, placement implementation, and what can be promised to advertisers.

### Answer

Resolved. Launch with direct, first-party sponsorships only. Track sponsored-placement clicks immediately. Add viewable-impression tracking only after a placement format and visibility rule are agreed.

## #3: Choose the first media-kit format

Type: Discuss

### Question

Will the first media kit be a private PDF for sales conversations, a public page, or both? This determines review, update cadence, and which figures may be shared publicly.

### Answer

Resolved. Produce a dated private PDF first and share current figures through a private Umami report with qualified partners. Reconsider a public page after the offer and figures settle.

## #4: Add the Umami tracker

Type: Prototype

### Question

How should the Next.js layout load the Umami tracker for public visitors, including a temporary holding page, with a site ID and tracker URL supplied through public environment variables?

### Answer

Resolved. Load Umami once with `next/script` in the public frontend layout for
both the live site and any public holding page, but never in Sanity draft mode. Set
`NEXT_PUBLIC_UMAMI_WEBSITE_ID` to the Pittogramma website ID in local and
Netlify environments. The tracker uses the existing self-hosted instance at
`https://umami.net-work.studio/script.js`, restricts collection to the
production domains, and respects Do Not Track.

Launch without an ad-blocker bypass. Check the initial reporting gap first. If
it is material, add a first-party rewrite that proxies both the tracker script
and collection endpoint. Do not proxy only the script.

## #5: Implement the event vocabulary

Blocked by: #4

Type: Prototype

### Question

Which client interactions should send the approved first-party events, and which stable non-personal properties identify a placement or campaign?

### Answer

Pending. The initial candidates are newsletter confirmation, media-kit download, advertising contact, sponsored-placement click, and viewable sponsored impression.

## #6: Build the campaign and placement model

Blocked by: #5

Type: Discuss

### Question

What placement formats, availability rules, labelling, campaign dates, pricing basis, and report fields will Pittogramma sell?

### Answer

Pending.

## #7: Produce the first media kit

Blocked by: #5, #6

Type: Prototype

### Question

How should Pittogramma present a fixed reporting period, audience figures, editorial sections, newsletter figures, placement offer, and methodology in the chosen format?

### Answer

Pending.

## #8: Improve discoverability and referral measurement

Blocked by: #4, #5

Type: Prototype

### Question

Which sitemap gaps, Search Console checks, internal links, article metadata, image-preview rules, and UTM-tagged partner distribution should ship in the first reach release?

### Answer

Pending. Start by auditing designer and event detail-page sitemap coverage, then implement `max-image-preview:large` and measure UTM-tagged newsletter and partner traffic.
