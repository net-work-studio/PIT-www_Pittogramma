# Umami tracker and ad-blocker research

Research date: 2026-08-28  
Scope: official Umami documentation and official Umami source only.

## Finding

Ad-blocker mitigation is optional, not a prerequisite to enabling Umami. Without it, some visits and events will be absent: Umami documents that blocklists can block its tracker despite its privacy-focused design. No documented measure guarantees collection from every visitor or blocker.

For a privacy-first editorial site, do not make bypassing a deliberate visitor choice an objective. Treat the data as a useful, consistently measured sample and disclose the limitation in advertiser reporting. If measurement loss proves material, use the first-party proxy option below before adding more invasive analytics.

## What applies to Pittogramma

The supplied tracker loads from `https://umami.net-work.studio/script.js`. The production-site configuration in this repository identifies the public site as `https://pittogramma.xyz`. These are different registrable domains, so the current integration is third-party from the browser's point of view. A filter that blocks the Umami hostname can still prevent loading even if the default script path is renamed.

Umami identifies two independently blockable resources for a self-hosted instance: the tracker script and its collection endpoint. Address both; renaming only the script leaves the event request on the default collection route.

| Option | Required change | Value and limitation |
| --- | --- | --- |
| Leave the supplied snippet unchanged | None. | Lowest operational risk; expects some undercounting. |
| Rename Umami resources | On the Umami host, configure `TRACKER_SCRIPT_NAME` (for example, `metrics.js`) and `COLLECT_API_ENDPOINT` (for example, `/api/metrics`), restart/redeploy Umami, and change the site script URL to the new script path. | Umami's built-in self-hosted mitigation. The tracker automatically uses the configured collection endpoint. It may evade path-based filters but still exposes the `umami.net-work.studio` hostname. Requires Umami version 1.34.0+ for the collection-endpoint variable. |
| Proxy through the public site | Configure the public site's hosting layer to serve a neutral route such as `/assets/insights.js` and forward both the tracker script and collection request to the Umami instance. Load the script with the relative first-party URL. | Umami documents server-level proxying and names Next.js rewrites as an option. This is the strongest documented approach against hostname filtering, but it adds proxy configuration, forwarding-header correctness, cache/error monitoring, and a route that must be kept in sync with Umami upgrades. Do not proxy merely the script: collection requests must reach Umami too. |
| Copy the tracker script into the public site | Host a saved tracker file locally and set `data-host-url` to Umami. | Umami describes this as less reliable than proxying because tracker updates must be manually copied. It also still sends data to the Umami hostname unless that endpoint is separately proxied. Not recommended. |

## Recommended sequence

1. Ship the official tracker with the supplied site ID and observe the baseline.
2. Test with the team's representative browser/blocker configuration: verify both the script response and the POST collection request in the browser Network panel. Umami explicitly recommends this diagnostic.
3. If the gap is material for reporting, prefer a first-party proxy on `pittogramma.xyz` for both resources. Keep `umami.net-work.studio` as the private dashboard/origin service. Use neutral, stable public paths that do not collide with application routes.
4. Alternatively, or as a smaller first step, rename the two self-hosted Umami paths. This is a configuration change to the Umami deployment, not to the Pittogramma repository.
5. Keep the media-kit methodology clear: metrics are Umami-measured visits and actions, not a census of every visit or an ad-impression guarantee.

## Sources

- Umami, [Bypass ad blockers](https://docs.umami.is/docs/bypass-ad-blockers): documents the blocker limitation; server-side proxying; self-hosted `TRACKER_SCRIPT_NAME` and `COLLECT_API_ENDPOINT`; and the local-script alternative and its update drawback.
- Umami, [Environment variables](https://docs.umami.is/docs/environment-variables): defines `COLLECT_API_ENDPOINT` (introduced in 1.34.0) and `TRACKER_SCRIPT_NAME` (introduced in 1.26.0), including custom path support.
- Umami, [Collect data](https://docs.umami.is/docs/collect-data): recommends using `next/script` in Next.js and inspecting the Network panel when data does not arrive.
- Umami source, [next.config.ts](https://github.com/umami-software/umami/blob/master/next.config.ts): confirms that the custom collection route rewrites internally to `/api/send`, and custom tracker names rewrite to `/script.js`.
