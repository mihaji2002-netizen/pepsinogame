#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/web"
GITHUB_PAGES=true npm run build
cd "$ROOT"
rm -rf _next login mentor onboarding register student 404 404.html index.html index.txt \
  favicon.ico file.svg globe.svg next.svg window.svg __next* _not-found 2>/dev/null || true
cp -a web/out/. .
touch .nojekyll
echo "Published static export to repo root. Commit and push to update GitHub Pages."
