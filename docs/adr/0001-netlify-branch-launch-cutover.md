# Use a Netlify branch launch cutover

Pittogramma moves from Vercel to its existing Netlify project while retaining the Infomaniak-managed DNS zone. The `countdown-page` branch is the temporary production branch, and a manual switch to `main` at 00:00 CEST on 1 September 2026 performs the launch; this keeps the Production domain attached to one Netlify project, enables rollback, and avoids a domain transfer between sites.
