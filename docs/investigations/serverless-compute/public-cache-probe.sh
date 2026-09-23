#!/bin/sh
# Read-only response-cache probe. Exactly three sequential GETs, no retries.
# Exit 1 means no CDN hit observed; it is not an exact compute/billing test.
set -eu
url=${1:-https://pittogramma.xyz/}
case "$url" in
  https://*|http://localhost:*|http://127.0.0.1:*) ;;
  *) printf 'Expected an HTTPS URL or local fixture URL\n' >&2; exit 2 ;;
esac
probe_dir=$(mktemp -d)
trap 'rm -rf "$probe_dir"' EXIT HUP INT TERM
hits=0
printf 'utc=%s url=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$url"
for n in 1 2 3; do
  curl -q -sS --max-time 25 -D "$probe_dir/headers" -o /dev/null \
    -w "sample=$n status=%{http_code} ttfb=%{time_starttransfer} total=%{time_total}\n" \
    "$url"
  awk 'tolower($0) ~ /^(cache-control|cache-status|x-nf-request-id):/' "$probe_dir/headers"
  if awk '
    tolower($0) ~ /^cache-status:/ {
      count=split($0, entries, ",")
      for (i=1; i<=count; i++) {
        if (entries[i] ~ /"Netlify (Edge|Durable)";[[:space:]]*hit([;[:space:]]|$)/) hit=1
      }
    }
    END { exit !hit }
  ' "$probe_dir/headers"; then
    hits=$((hits + 1))
  fi
done
printf 'public CDN hits=%s/3\n' "$hits"
test "$hits" -gt 0
