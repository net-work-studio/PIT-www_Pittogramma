# Pittogramma serverless compute investigation

Investigation on 23 September 2026, production read-only. Read NWS-2075 and related NWS-2074, NWS-2076, NWS-2182, NWS-2183, NWS-2184, NWS-1798, NWS-1791 and NWS-1803 before collecting evidence. No production deployment, setting change, CMS write, form submission or intentional invalidation was performed. Normal browser loads emitted the site's normal analytics requests. Local changes contain investigation artifacts only.

The strongest explanation for invocation volume is public HTML and RSC requests reaching the shared Next.js handler, amplified by Uptime Kuma and automatic prefetch. The shared layout's short settings cache creates request-time content across the public site; the homepage adds an unconditional `connection()` marker. Umami ingestion also runs through the handler. These mechanisms are observed, but the retained data cannot divide the historical 47 GB-hours among them.

## Baseline and limits

| Item | Value and provenance |
| --- | --- |
| Historical billing window | 23 August through 22 September 2026, supplied by the user |
| Serverless invocations / compute | 194,000 / 47 GB-hours, supplied totals, not independently reconstructed |
| Current deployed handler | `___netlify-server-handler`, 1,024 MB, Node.js 22.x, streaming, `us-east-1` / `iad` |
| Deployment | `6a9c1d93da0f7100085d8fdc`, published 5 September 2026 at 13:50 UTC |
| Source | `c2d4deab684ba934aac47253a4842b533062b95b`, matches local HEAD |
| Versions | Next.js 16.3.2, next-sanity 13.2.3, React 19.2.8; deployed Netlify Next.js adapter 5.15.13 |
| Function artifact | 30,532,457 bytes, observed deployment metadata; not a cold-start measurement |
| Retained request sample | 16 September 15:20:01.408 UTC through 23 September 15:20:01.408 UTC |
| Logs available | Seven days; UI's 30-day option disabled for this plan |

At a constant allocation of 1 GB, `47 * 3600 / 194000 = 0.8722` seconds per invocation. This is an implied average from rounded billing totals, not an observed duration distribution. Memory history, earlier deployment behavior and billing rounding were not verified. The retained request window includes 23 September and omits most of the billing window. It must not be scaled into a monthly attribution.

Netlify's request duration measures the request through its CDN. It is not a billing-duration counter. A request can include edge processing, function execution, upstream waits and transport. Edge duration can include downstream execution; adding the edge and function columns double-counts overlapping time. Function execution timings are closer to the compute of interest, but the available UI does not expose a complete per-request billed-duration ledger. See [Observability](https://docs.netlify.com/manage/monitoring/observability/overview/) and [function request metrics](https://docs.netlify.com/manage/monitoring/observability/reference/functions/).

There are three different cache questions: whether Sanity or a Cache Component supplies cached data, whether Next.js supplies a cached result inside the handler, and whether Netlify supplies the response without running the handler. Only the last directly avoids a serverless invocation. A Netlify Edge miss can still be a Netlify Durable hit. `stored`, a Next.js hit or a Sanity CDN hit does not prove absence of function execution. The adapter can invoke on initial access after deployment even for prerendered content. See [Netlify's Next.js integration](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/).

## What the retained traffic shows

The following are rounded UI observations, not an additive billing table. The fixed-window dashboard changed from about 75.3K to 75.5K requests during inspection. Function grouping showed about 31.8K requests; a filtered header showed 32,032. Other grouped totals did not reconcile exactly, even with the same timestamp parameters. Preserve that discrepancy rather than manufacture percentages or sums. Durations below are whole-request medians, not function medians. No bandwidth percentage is used.

| Request class | Requests / function-attributed requests shown | CDN request p50 | Interpretation |
| --- | --- | --- | --- |
| HTML | 18.7K / 18.5K | 1,707 ms | Major rendering entry point; includes monitors and crawlers, not just people |
| RSC `text/x-component` | 12.5K / 12.1K | 515 ms | Includes prefetch, navigation and refresh; content type alone cannot separate them |
| JSON | 936 / 815 | 980 ms | Overlaps analytics and API routes |
| Plain text | 2.9K / 2.2K | 425 ms | Includes action/other responses; not a route classification |
| XML | 266 / 266 | 601 ms | Sitemap/feed handling remains dynamic |
| JavaScript | 13.6K / 33 | Mostly asset traffic | Most script delivery avoids the handler |

| URL shown | Requests / function-attributed requests | CDN request p50 |
| --- | --- | --- |
| Primary `/` | 12.2K / 12K | 1,772 ms |
| `/projects` | 1.3K / 1.2K | ~650 ms |
| `/submit` | 1.3K / 1.2K | 367 ms |
| `/about` | 1.2K / 1.1K | 960 ms |
| `/journal` | 1.2K / 1.1K | 451 ms |
| `/events` | 1.2K / 1.1K | 425 ms |
| `/p/api/send` | 941 / 913 | 936 ms |
| `/studios-agencies` | ~552 / ~519 | ~1,087 ms |
| `/bibliography` | ~448 / ~418 | ~1,038 ms |
| Other support/info routes, including contribute, impressum, privacy, cookies and submission terms | Each roughly 374–432 requests and 362–405 attributed executions | Roughly 377–416 ms |
| `/type-foundries` | ~358 / ~326 | ~665 ms |
| `/projects/gamut` | ~345 / ~334 | ~566 ms |
| `/robots.txt` | ~687 / 1 | Mostly cached |
| `/assets/p.js` | ~318 / ~29 | ~186 ms |
| `/_next/image` | ~7.7K / none shown | Asset optimization traffic, not this handler |

The UI also displayed a second `/` group with about 10K requests, no attributed function and a 143 ms median. The shortened label does not establish an identical origin or redirect behavior. Do not merge it with the primary homepage row. URL labels alone also do not separate HTML from RSC.

Uptime-Kuma/2.4.0 accounted for approximately 9.8K requests in the function-filtered user-agent view, all attributed to the handler, with a 1,821 ms request median and no errors shown. This is a strong, directly addressable volume source. The observed homepage request had a cache-busting query. The dashboard does not establish the monitor's configured schedule or retry policy. The earlier issue's approximately 10K figure is consistent with a slightly different seven-day window.

Unfiltered user-agent categories showed browsers 41.8K requests / 17.9K attributed executions, tools 22K / 11.1K, crawlers 7.2K / 4K, page previews 2.6K / 479, other 1.2K / 578, AI agents 213 / 160 and unknown 84 / 66. These overlap the URL/content classes and must not be added to them. Browser-looking agents include scanners. For example, the filtered Bytespider row showed 605 requests, 585 executions and 161 errors; a HeadlessChrome row showed 636 errors. This does not identify all automated traffic reliably.

The POST view contained 1,688 requests and reported 26.6% errors. It included 941 analytics ingestion requests, 181 homepage POSTs, scanner targets such as `/api`, `/admin`, `/login`, `/dashboard` and WordPress paths. Homepage POSTs can be Sanity server actions or hostile/invalid action requests. Four `/api/newsletter` POSTs all appeared as errors. There is no evidence that newsletter traffic materially drives total compute. A dedicated `/api/expire-tags` search returned no results in the retained window; a later broader API query failed in the UI. Neither establishes historical absence.

## Direct measurements

Run `sh docs/investigations/serverless-compute/public-cache-probe.sh` for the bounded three-GET reproduction. It sends no cookies, cache-buster or cache-control override, records status, client TTFB, total duration, response cache headers and request IDs, and returns nonzero if no response is a Netlify Edge/Durable hit. A hit is only a cache regression signal; use request details to verify actual function execution. It is not a billing test.

The original run on 23 September returned **0/3 CDN hits**, all HTTP 200, all `private,no-cache,no-store,max-age=0,must-revalidate`, Netlify Durable bypass and Edge miss.

| Sample | Client TTFB / total, seconds | Request ID |
| --- | --- | --- |
| Home 1 | 1.879917 / 2.425773 | `01M37DK6YXXA2KB60249DFFTPK` |
| Home 2 | 1.141164 / 2.404402 | `01M37DK9BKS86D3FSF859RXYBX` |
| Home 3 | 1.042023 / 1.908710 | `01M37DKBQ58ZHJ4VEB0FKYNC4M` |

The saved script was rerun at 15:45:15 UTC, again returning exit 1 and 0/3 hits. TTFB/total seconds were 2.591713/3.514509, 1.194150/1.659322 and 1.122473/1.859630. Request IDs were `01M37F2MBPM1KS7QBKSVSJ94RJ`, `01M37F2QPDNBAKMEXXX24Y49F1` and `01M37F2SBYFME8DTEBMH5JHD0P`. All three again returned private/no-store, Durable bypass and Edge miss.

Two sequential GETs each to `/about`, `/projects` and `/projects/gamut` also returned private/no-store and Durable bypass. Their TTFBs ranged from 0.950 to 2.425 seconds. `/sitemap.xml` bypassed Durable twice. `/robots.txt` hit Durable twice despite Edge misses. `/assets/p.js` went from a stale revalidation to a Durable hit. Exact route samples are preserved in [route-probes.txt](serverless-compute/route-probes.txt).

A separate 1280×720 homepage reload, without scrolling or clicking, emitted 67 requests to pittogramma.xyz, including ten RSC GETs and one analytics fetch. Ten prefetches targeted five destinations: `/journal`, `/events`, `/about`, `/submit` and `/interviews/matteo-bologna`. Each had `RSC: 1` and `Next-Router-Prefetch: 1`: first the `/_tree` segment, then the page segment. This is a measured no-click amplification in one existing browser session, not a universal requests-per-visitor multiplier. The session's browser cache was not cleared.

The journal tree request `01M37EGA6NF66377VK2P87E231` reported `"Next.js"; hit; fwd=stale`, `"Netlify Durable"; fwd=bypass; ttl=-17293` and an Edge miss. The page request `01M37EGB66KM5WZ216XZYJW8JA` did likewise. These stale-cache signals need to be interpreted per layer. Their negative TTLs do not establish a 17,293-second user-visible content staleness or a billed duration.

The Sanity live EventSource connected directly to `jfvmcjyl.api.sanity.io`, outside Netlify. Its open connection and routine live-event traffic are not continuous Netlify execution. Image requests to Sanity's CDN are also separate.

| Request detail | Whole request / edge / function, ms | Evidence |
| --- | --- | --- |
| Uptime Kuma homepage | 3,309 / 3,154 / 1,941 | `01M37D5DNWFYAB12Z7355QVRNR`, 23 Sep 17:11:50.972 CEST |
| Exploratory homepage GET | 3,357 / 3,085 / 1,933 | `01M37DJEANWBTEJR8X3WFYXMNW`, 17:18:57.621 CEST |
| Home probe 3 | 874 / 616 / 369 | `01M37DKBQ58ZHJ4VEB0FKYNC4M`, 17:19:27.717 CEST |
| Umami POST, 200 | 1,173 / 1,020 / 790 | `01M37CJPDWV6308CFXDJF81D5W`, 17:01:37.340 CEST |
| `/submit` RSC, 200 | 250 / 247 / 125 | `01M37CJPXM0CPAB0AED9Y7E545`, 17:01:37.844 CEST |

These function samples establish that monitor HTML, analytics and RSC all execute the handler with different costs. They cannot rank aggregate GB-hours without duration distributions and counts over the same window. A first request being slower than subsequent requests does not diagnose a cold start.

## Code and installed-documentation trace

`src/app/(frontend)/layout.tsx:60` puts the whole frontend content beneath Suspense. It reads `draftMode().isEnabled`, then awaits `getCachedPublicSiteSettings`. At line 133 that cached function sets `cacheLife({expire:60,revalidate:10,stale:0})`. Its result controls live, countdown and maintenance states before header, page and footer render.

The installed Next.js 16.3.2 `cacheLife.md` explicitly excludes cached work with `expire < 300` from prerendering and excludes `stale < 30` from prerenders. Values of `stale` between 30 and 300 also keep content out of the App Shell. Thus this short-lived setting is a dynamic dependency of the shared layout, even though its Sanity result can be cached between executions. The one-year Sanity cache default does not cancel the explicit short policy: installed `cache-life.js` takes the minimum of multiple explicit calls in the same cache scope. A separately nested cache has separate propagation rules.

`src/app/(frontend)/page.tsx:169–189` branches on draft mode, wraps the public data work in `use cache`, but also always renders `DynamicMarker`, which awaits `connection()` and returns null. This expressly requires request-time rendering. Removing it alone leaves the layout's short cache dependency.

`draftMode()` itself is not sufficient evidence of a dynamic public route. The installed implementation supplies a disabled draft provider while prerendering. Only enabled draft mode takes the request cookie path in `getDynamicFetchOptions`; draft rendering bypasses caching as documented. Keep draft behavior and private responses intact. Do not remove draft preview to obtain a misleading public-cache win.

An isolated Next.js 16.3.2 fixture, using the installed packages and Bun 1.3.14, reproduced this independently of Sanity. See [local-cache-fixture.sh](serverless-compute/local-cache-fixture.sh). No project secrets are required.

| Fixture | Production build classification | Local response |
| --- | --- | --- |
| Literal static page | Static | `s-maxage=31536000`, Next.js HIT |
| `await draftMode()` with a public branch | Static | Same |
| Cached settings, stale 0 / revalidate 10 / expire 60 | Partial prerender | Private/no-store |
| Only expire changed to 600 | Partial prerender | Private/no-store |
| Then stale changed to 300 | Static | `s-maxage=10, stale-while-revalidate=590` |
| `await connection()` | Partial prerender | Private/no-store |

This isolates each policy change. It supports the documented Next.js mechanism, not the complete Netlify adapter or the application's maintenance semantics. The local process ran on Bun; production runs on Node.js 22. Next.js warned on some builds that the runtime's `setTimeout()` implementation prevents a Cache Components guarantee. All completed builds retained the same route classification, but the deployed-runtime preview must confirm it. The fixture uses warning-level instant validation. A full application build was not performed without the required Sanity runtime credentials.

`/projects` awaits `searchParams` under Suspense before entering its cached data component. That query-dependent route needs separate treatment even if the shared layout becomes cacheable. Detail routes such as `/projects/[slug]` generate the first 100 eligible slugs at build time; that neither covers every slug nor overrides a dynamic shared ancestor.

`src/app/sitemap.ts` and `src/lib/seo/content-rss-feed.ts` explicitly call `connection()` for timed public-site state. RSS routes `/feed.xml`, `/projects/feed.xml`, `/journal/feed.xml` and `/interviews/feed.xml` use cached queries but response headers require revalidation. Removing their request-time work blindly risks incorrect launch/maintenance behavior.

The homepage queries four content groups in parallel after reading the cached local date. Shared header, footer, metadata and root SiteSchema add cached query scopes. Query counts in source are not queries per invocation: cache reuse, parallelism and deduplication matter. The date helper uses a five-minute revalidation and one-hour expiry. No CPU profile, render spans or GROQ query timings establish how much execution time rendering consumes.

Next's `next-js` conditional export resolves next-sanity's Cache Components implementation when `cacheComponents` is enabled. On a miss it performs one client query for this path, tags the cache and uses published CDN reads with `noStale` cache mode. Do not assume the two-fetch path of a different next-sanity export applies here. Relevant installed sources are `node_modules/next-sanity/dist/live/conditions/next-js/index.js` and Next's webpack condition selection.

`SanityLive` receives an explicit `includeDrafts` flag, avoiding an implicit dynamic API lookup there. Its direct SSE message handler can call a Netlify server action, invalidate tags and refresh the router. Welcome and reconnect events only log; restart refreshes; a goaway fallback polls through refresh at 30 seconds. A public content event can therefore fan out into actions and RSC refreshes across open browsers. No count of open browsers or event IDs was retained.

The default `prefetchInlining` in Next.js 16.3 is already enabled, as is the repository setting. Disabling it can increase request count. The installed prefetching guide distinguishes automatic viewport prefetch, actual navigation and partial segment requests. A targeted `prefetch={false}` experiment has a clearer prediction than globally switching the inlining setting.

Installed documentation used: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/{cacheLife,draft-mode,connection}.md`, `01-directives/use-cache.md`, `05-config/01-next-config-js/prefetchInlining.md`, and `01-app/02-guides/prefetching.md`. Installed source inspection supplemented these docs; no older Next.js assumptions were used as evidence.

## Duration, expiry, invalidation and failures

The `public-site-robots` edge function awaits `context.next()` and then a separate Sanity settings query. Its isolate-local cache lasts ten seconds, with no in-flight request deduplication and no explicit fetch timeout. Failure falls back to the previous state or live mode. Its path exclusions omit `/p/api/send`, `/assets/p.js` and a future `/health.txt`. This can add CDN latency to analytics and asset requests as well as pages. The edge timing includes downstream time, so it cannot be charged wholesale to serverless compute or added to the function duration.

Umami rewrites in `next.config.ts` send `/assets/p.js` and `/p/api/send` to `umami.net-work.studio`. Observed function attribution and a 790 ms sample confirm serverless execution on ingestion. A function log on 17 September 16:17:47 CEST, ID `45ac3863`, records `Failed to proxy .../api/send`, `write EPIPE`, errno -32. This establishes a proxy failure, not a measured breakdown of upstream wait versus adapter work. The retained URL row showed 39 errors among 941 ingestion requests. The script is mostly cached; treat it separately from ingestion.

Function logs contain repeated Next.js `E1163` cache warnings. On 16 September they appeared at 17:33:41, 17:51:54, 17:58:05, 18:01:54 and 18:03:09 CEST. Another invocation on 23 September at 17:26:53, ID `7e473fce`, logged it twice, with 893.17 ms duration and 244 MB usage. The installed `use-cache-wrapper.js` links this warning to cache misses after prerender cache warming, dynamic holes and potentially redundant runtime prefetch. Two warnings in one invocation are not two invocations. Minified production frames do not identify the application's offending cache boundary conclusively. Do not claim an unstable-array argument bug without symbolication or a route-level reproduction.

Repeated invalidation is directly visible. Five distinct function IDs logged the same five Sanity tags between 17 September 14:52:34 and 14:52:41 CEST: `9f18f25d`, `2a52a4db`, `506f26e0`, `b0c75416`, `1650f0fe`. Five more logged that set by 14:54:42. The set was `sanity:s1:Gw/EWg`, `sanity:s1:KMH1tQ`, `sanity:s1:RpGAWw`, `sanity:s1:ZLo2wg`, `sanity:s1:eTw08A`. Nineteen matching log entries were visible across the retained search; this is a lower bound, not a complete count. Browser fan-out is a plausible cause, but independent publishes or retries cannot be separated without event IDs.

The public next-sanity server action calls `revalidateTag(tag, "max")` and returns a refresh signal. `/api/expire-tags` separately checks bearer authentication, validates payloads, deduplicates at most 200 tags and also invalidates `sanity:fetch-sync-tags`. Its Sanity function caller throws on failed POSTs and acknowledges tags after success. The deployment's retry policy was not established. No endpoint was invoked as a test. NWS-2076 still needs its controlled publish/preview validation; repeated logs do not prove that every intended invalidation path works correctly.

The installed Sanity client has retries for eligible failures such as 429, 502 and 503, with a default of five retries and exponential delay plus jitter. Such waits can extend a function's wall time. No retained trace proves their frequency here. Newsletter and authenticated enrichment APIs also have outbound waits, commonly ten-second timeouts; place search additionally queues through an in-process one-second limiter. Code establishes exposure, not material historical cost.

The logs also showed invalid server-reference IDs, and `Failed to find Server Action` on 22 September 04:08:27, ID `a83d2f86`. These can arise from bad/scanner requests or deployment skew. They are not proof of a retry storm. Some observed analytics and RSC requests ended with 499 and lacked function details; missing details after an abort do not prove zero compute. A legacy missing-media request took 3,855 ms and a content route sample took 7,440 ms overall. Tail latency exists, but neither sample isolates its cause.

Searching retained logs for `Init Duration` returned no results. Netlify's simplified log presentation and seven-day retention do not establish zero cold starts. Artifact size and first-request latency make startup a hypothesis, but there are no initialization spans, execution-environment IDs or cold/warm pairs to quantify it. Memory usage samples around 200–319 MB are not allocated memory and do not justify reducing the 1,024 MB setting without testing the CPU/duration tradeoff. See [function log retention and fields](https://docs.netlify.com/build/functions/logs/).

## Ranked causes and smallest safe changes

Ranks describe evidence and likely addressability, not an invented allocation of GB-hours.

| Rank | Finding and confidence | Smallest safe proposed change | Validation before production |
| --- | --- | --- | --- |
| 1 | Public shared layout and homepage remain dynamic. High confidence in mechanism and observed execution; unknown monthly compute share. | Remove the null homepage `DynamicMarker` in a preview. Separately resolve the shared settings freshness contract before changing both `stale` and `expire`. Keep preview cookies private. | Compare unchanged baseline with each change independently. Run the three-GET probe and confirm no handler on warmed eligible responses in Netlify details. Check homepage, info page, detail page, filtered projects, draft preview, scheduled launch and maintenance transitions. Removing the marker alone is insufficient. |
| 2 | Kuma repeatedly invokes HTML rendering. High confidence, ~9.8K retained executions. | Complete NWS-2182 with a static `/health.txt`, canonical URL and no cache-buster. Exclude it from the robots edge function too. Keep a separate, lower-frequency rendered-page check. | Verify 200 without redirects, handler or edge execution, then compare monitor-filtered invocation counts over matching windows. A static check cannot detect broken rendering. NWS-2183's one-to-five-minute change reduces only that scheduled stream by 80% when the current schedule is verified. |
| 3 | Automatic RSC prefetch adds executions before navigation. High confidence in ten-request sample; medium confidence in avoidable aggregate share. | Trial `prefetch={false}` on low-value/high-count links, one group at a time. Preserve normal click navigation. | Same viewport and interaction script, record prefetch headers and function attribution, click latency and mobile LCP. Test after cache changes too. Do not disable `prefetchInlining` as an assumed optimization. |
| 4 | Analytics ingestion runs the handler and sometimes fails upstream. High confidence in execution, medium in external-wait contribution. | Evaluate a platform proxy that bypasses Next.js, or direct ingestion only if analytics/privacy/ad-blocker requirements permit. Exclude analytics paths from unnecessary robots edge work as a separate change. | One accepted analytics event, no duplicate delivery, correct origin/CORS behavior, retained error rate and measured function attribution. This project's ad-blocker requirements make moving the URL a product decision. |
| 5 | Repeated tag invalidation and E1163 can trigger extra query/render work. High confidence in occurrence, medium/low in total impact and specific cause. | First correlate event IDs and route/cache scopes in preview. Reproduce E1163, then fix its identified boundary. Consider event deduplication only with a correct cross-instance key and freshness contract. | Publish one test item in a non-production dataset with one and several browser sessions. Count actions, tags, queries and refreshes, test missed-event recovery and draft updates. Do not simply disable SanityLive or remove the fallback invalidator. |
| 6 | Crawlers, scanners, missing routes and dynamic XML add executions. High confidence in traffic; medium in avoidability. | Correct legitimate legacy links/redirects. Consider targeted rate limits for demonstrated abuse. Review XML freshness separately. | Verify legitimate crawler/indexing access and redirect targets. Compare status, UA and route counts, not bandwidth. Avoid broad bot blocking based only on UA strings. |
| 7 | Cold starts, rendering CPU and Sanity retries may extend duration. Low confidence as ranked historical causes. | Add bounded preview measurements before tuning memory, bundle loading, GROQ or concurrency. | Separate startup, Sanity query wall time, Umami wait, render CPU and total function duration. Repeat cold/warm experiments under the deployed runtime/adapter. No production performance claim until measured. |

## Reproduction and next measurement

1. Record source SHA, deployment ID, memory, runtime and fixed UTC window. Use the [saved Observability window](https://app.netlify.com/projects/pittogramma/analytics-and-metrics/observability?from_ts=1789572001408&to_ts=1790176801408). The UI will lose the window after retention expires; the tables and request IDs above preserve the observations.
2. Group by Function, URL, Content type, User agent and User agent category separately. Inspect GET versus POST and full origins. Record rounding and inconsistent totals. Open representative request IDs and copy function execution separately from whole-request duration.
3. Run the bounded public probe. Retain only the allowlisted response headers. For browser work, capture a fresh no-click load at a recorded viewport, then a separate navigation sequence. Classify `RSC`, `Next-Router-Prefetch`, segment headers, action headers, origin and method. Never save cookies, tokens, analytics payloads or complete HAR files without redaction.
4. Run the isolated cache fixture. In a deployment preview with valid Sanity configuration, change one cache dependency at a time and repeat the route matrix. Test cache expiry, a controlled publish, multiple tabs, draft entry/exit and scheduled site-state changes. No such production mutations were performed here.
5. For exact future attribution, retain a sampled, redacted request record keyed by request ID, route template, request class, deploy and status. Add monotonic durations for upstream calls and render work, cache outcome at each layer, retry count, invalidation event ID/tag hash and cold-start marker. Join with actual function duration, allocation and billed duration if the platform export provides it. Aggregate counts and `sum(duration × allocated_GB)` over the same window; do not multiply p50 by request count. Keep concurrency and overlapping spans from being double-counted.

The existing telemetry lacks per-route historical billed duration, CPU profiles, upstream timing spans, cache-key outcomes and complete event/retry correlation. Netlify Observability has no supported programmatic retrieval API in the inspected documentation. This investigation therefore establishes actionable causes and a reproducible cache failure, but cannot exactly apportion the 47 GB-hours. Deploy credits in NWS-2184 remain a separate cost category.

The diagnosing-bugs workflow used a failing production read-only cache probe and a minimized local differential fixture. Fix-and-retest phases remain proposed because the task requests an investigation with production kept read-only. No application fix is claimed. Local dependencies were restored with frozen-lockfile, offline Bun 1.3.14 installation. Final validation passed: both shell scripts parse, the saved fixture builds with the classifications above, the saved public probe reproduces 0/3 hits, and `bun run check` checks 361 files with no fixes or warnings. The temporary local server was stopped.

[NWS-2075](https://linear.app/nws2/issue/NWS-2075) was updated with a self-contained findings comment at 15:47 UTC on 23 September, comment ID `104b8419-9767-46c6-860f-2c7b59ff3f2b`. Its status was left unchanged. These repository artifacts are uncommitted.
