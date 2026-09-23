#!/bin/sh
# Isolated debug fixture: creates files in a new temporary directory only.
# Uses this checkout's installed Next/React and Bun 1.3.14. No Sanity/network calls.
# Usage: sh docs/investigations/serverless-compute/local-cache-fixture.sh
set -eu
repo_dir=$(git rev-parse --show-toplevel)
test "$(bun --version)" = 1.3.14 || {
  printf 'Use the repository-pinned Bun 1.3.14\n' >&2
  exit 2
}
test -d "$repo_dir/node_modules/next" || {
  printf 'Install the locked dependencies first\n' >&2
  exit 2
}
fixture_dir=$(mktemp -d)
printf 'Debug fixture retained at %s\n' "$fixture_dir"
ln -s "$repo_dir/node_modules" "$fixture_dir/node_modules"
mkdir -p "$fixture_dir/app"
cat > "$fixture_dir/package.json" <<'JSON'
{"private":true,"dependencies":{"next":"16.3.2","react":"19.2.8","react-dom":"19.2.8"}}
JSON
cat > "$fixture_dir/next.config.js" <<'JS'
module.exports = {cacheComponents:true, experimental:{instantInsights:{validationLevel:'warning'}}};
JS
cat > "$fixture_dir/app/layout.jsx" <<'JS'
import {Suspense} from 'react';
export default function Layout({children}) { return <html><body><Suspense fallback={<p>waiting</p>}>{children}</Suspense></body></html>; }
JS
for route in static draft short short-expire bounded marker; do
  mkdir -p "$fixture_dir/app/$route"
done
cat > "$fixture_dir/app/static/page.jsx" <<'JS'
export default function Page(){return <p>static</p>;}
JS
cat > "$fixture_dir/app/draft/page.jsx" <<'JS'
import {draftMode} from 'next/headers';
export default async function Page(){ const {isEnabled}=await draftMode(); return <p>{isEnabled?'draft':'public'}</p>; }
JS
cat > "$fixture_dir/app/marker/page.jsx" <<'JS'
import {connection} from 'next/server';
export default async function Page(){ await connection(); return <p>public</p>; }
JS
for route in short short-expire bounded; do
  case "$route" in
    short) stale=0; expire=60 ;;
    short-expire) stale=0; expire=600 ;;
    bounded) stale=300; expire=600 ;;
  esac
  cat > "$fixture_dir/app/$route/page.jsx" <<JS
import {cacheLife} from 'next/cache';
export default async function Page(){return <p>{await Settings()}</p>;}
async function Settings(){'use cache'; cacheLife({stale:$stale,revalidate:10,expire:$expire});return 'public';}
JS
done
cd "$fixture_dir"
NEXT_TELEMETRY_DISABLED=1 bun --bun node_modules/next/dist/bin/next build --webpack
printf '\nStart the fixture with:\ncd "%s"\nbun --bun node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3217\n' "$fixture_dir"
printf '\nIn another terminal, compare GET response headers for /static /draft /short /short-expire /bounded /marker with curl -sS -D - -o /dev/null http://127.0.0.1:3217/ROUTE\n'
