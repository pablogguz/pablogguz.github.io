#!/usr/bin/env bash
# build the site + pagefind search index and serve it locally.
# (plain `zola serve` has no search index — this mimics the deployed site)
set -euo pipefail
cd "$(dirname "$0")/.."

zola build --base-url http://127.0.0.1:1112
npx --yes pagefind@1 --site public
echo "→ http://127.0.0.1:1112 (search enabled)"
python3 -m http.server 1112 -d public
