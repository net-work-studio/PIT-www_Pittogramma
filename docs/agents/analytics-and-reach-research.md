# Analytics and reach recommendation

Research date: 2026-08-27

## Decision

Use **Plausible Cloud on the Business plan** if Pittogramma's budget permits it. It is the better fit for an editorial site preparing an advertiser-facing media kit: goals, funnels, custom properties, the Stats API and share links are documented product features, and Plausible explicitly identifies potential partners and advertisers as a shared-dashboard use case. Keep the advertiser-facing evidence restrained: publish a dated media-kit page or PDF with a fixed reporting window and methodology, then give serious partners a password-protected, read-only dashboard link for current numbers. Do not make a permanently public live dashboard the only media kit.

Choose **Umami** instead if self-hosting, full data control or a custom embedded analytics view matters more than Plausible's managed advertiser-sharing workflow. Its feature set now overlaps strongly with Plausible, including events, properties, UTM analysis, funnels, attribution, boards and share URLs. That comes with operating a Node application and PostgreSQL, plus backups, updates and access control.

Both products describe themselves as cookie-free and privacy-first. That lowers the consent burden for their default tracking, but it is not a legal conclusion. Have the privacy notice, hosting location, DPA and all event properties reviewed for the applicable jurisdictions. Never put emails, names, full URLs containing identifiers, or other personal data in analytics events. Do not enable Umami session replay without a separate privacy and consent assessment.

## Comparison for Pittogramma

| Need | Plausible Cloud | Umami |
| --- | --- | --- |
| Hosted and self-hosted options | Cloud plans plus free, AGPLv3 self-hosted Community Edition. Some advanced hosted features, including funnels and revenue, are Business-plan features. [Self-hosted](https://plausible.io/self-hosted-web-analytics), [plans](https://plausible.io/docs/subscription-plans) | Managed Cloud or MIT-licensed self-hosting. Self-hosting needs Node 18.18+ and PostgreSQL 12.14+; the documented Docker Compose setup includes the application and PostgreSQL. [Installation](https://docs.umami.is/docs/install), [license](https://github.com/umami-software/umami/blob/master/LICENSE) |
| Privacy and data location | The service documents no cookies, no personal data or persistent identifiers, says no consent banner is required for its default analytics, and says managed data is stored and processed in the EU. [Compliance](https://plausible.io/docs/compliance) | The docs say no cookies, fingerprinting or personal data, with managed Cloud or self-hosted deployment. Cloud servers are in the US and EU. [Introduction](https://docs.umami.is/docs), [Cloud FAQ](https://docs.umami.is/docs/cloud/faq) |
| Newsletter and sponsor actions | Custom-event goals support CSS classes or JavaScript; properties can distinguish a placement, page, partner or CTA. Automated goals cover outbound links, file downloads and forms. [Custom events](https://plausible.io/docs/custom-event-goals), [outbound links](https://plausible.io/docs/outbound-link-click-tracking) | Events accept data attributes or `umami.track()` data. It also documents goals, funnels, UTM tracking and attribution. [Event data](https://docs.umami.is/docs/event-data), [overview](https://docs.umami.is/docs) |
| Campaign and funnel analysis | UTM and paid-click parameters, property-filtered goals, funnels, journeys and last-click conversion attribution. [Metrics](https://plausible.io/docs/metrics-definitions), [custom properties](https://plausible.io/docs/custom-props/for-custom-events) | UTM tracking, funnels, user journeys, retention, goals and first/last-click attribution are documented. [UTM](https://docs.umami.is/docs/utm), [attribution](https://docs.umami.is/docs/attribution) |
| Media-kit evidence | A shared link can be password-protected and fixed to an audience segment. Recipients need no account, and Plausible names advertisers and partners as a use case. [Shared links](https://plausible.io/docs/shared-links), [visibility](https://plausible.io/docs/visibility) | Website share URLs and custom boards can expose selected read-only analytics; analytics can also be embedded. [Public dashboard](https://docs.umami.is/docs/guides/create-a-public-dashboard), [embed guide](https://docs.umami.is/docs/guides/embed-analytics-in-your-app) |
| Cost model | Billable traffic includes pageviews and custom events, so do not emit noisy low-value events. Confirm the current Business-tier quote at procurement time. [Plans](https://plausible.io/docs/subscription-plans) | Cloud is usage-based, counts website hits and stored event properties, and has a free Hobby plan. Self-hosting moves the subscription cost to infrastructure and operations. [Cloud FAQ](https://docs.umami.is/docs/cloud/faq) |

## Measurement plan

Start with a small event vocabulary and attach only non-personal properties:

- `newsletter_signup_started`, `newsletter_signup_confirmed`, with `placement` equal to `footer`, `newsletter_card` or a new campaign placement. The existing Brevo workflow already records `SIGNUP_CONTEXT` for footer and newsletter-card submissions.
- `media_kit_opened`, `media_kit_downloaded`, `advertise_contact_clicked`.
- `sponsor_card_clicked`, with `partner`, `placement`, `content_type` and `content_slug`. Every sponsored destination should also receive a distinct UTM-tagged URL.
- `social_share_clicked`, with `network` and `content_type`, only if such controls are added.

Use a consistent UTM taxonomy for every paid, partner, newsletter and social link: `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content` for creative or placement. This connects site traffic and downstream site actions to a campaign. It does not measure ad impressions, spend or platform click-through rate. Those stay with the advertising platform or publisher report. Umami makes the same distinction in its [campaign guide](https://umami.is/docs/guides/measure-campaigns).

For a first media kit, report the last complete 90 days and the equivalent prior period: unique visitors, pageviews, top editorial sections, main countries, newsletter subscribers and opt-in conversion rate, plus sponsor-link clicks when available. State the tool, period, metric definitions and whether bot/internal traffic was excluded. Avoid demographic claims that the product cannot substantiate.

Paid sponsorship links must be marked `rel="sponsored"` or `nofollow`; Google specifically asks sites to qualify paid links. [Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

## Reach priorities beyond analytics

1. **Close the sitemap coverage gap and submit it to Search Console.** The current `src/app/sitemap.ts` enumerates only dynamic projects, interviews and journal posts. Before launch, check whether published designer and event detail pages should be included too, and exclude anything intentionally non-indexable. Google recommends including canonical, absolute URLs that should appear in results and using Search Console to investigate sitemap errors. [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

2. **Turn every editorial format into a discovery hub.** Build human-curated links between projects, designers, interviews, events, the glossary and related journal pieces. Use ordinary `<a href>` links with descriptive anchor text. Google says internal links help people and crawlers understand a site, and every important page should have a contextual link from another page. [Google link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)

3. **Make authorship and original reporting visible.** Add contributor pages, visible publication and update dates, concise editorial descriptions, source links and first-hand visual material. Google asks whether content has original reporting or analysis and whether it makes the creator's expertise and the publisher's background clear. [Helpful content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

4. **Use distribution partnerships as an editorial loop.** Give each collaborator, foundry, designer and event a tailored URL and UTM link, then publish a useful co-created item they have a reason to share. Measure the referral's reading depth proxy, newsletter confirmation and sponsor clicks, not only raw sessions.

5. **Protect the reading experience while monetizing it.** Keep placements labelled and visually secondary to the article. Google warns against ads that distract from or obstruct the content users came to read. [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

6. **Use the existing SEO base deliberately.** The application already has `robots.ts`, a dynamic sitemap, canonical metadata, Open Graph metadata, JSON-LD, a privacy-policy route and a double-opt-in Brevo newsletter flow. The next gains come from content coverage, internal linking, author signals, Search Console monitoring and attributable distribution, not from installing several analytics products.

## Sources

All product capability claims above link to the vendors' official documentation. Search recommendations link to Google Search Central, the primary source for Google crawling and ranking guidance.
