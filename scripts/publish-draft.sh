#!/usr/bin/env bash
# publish a draft: ./scripts/publish-draft.sh <slug>
# moves it out of the gitignored drafts folder, stamps today's date, drops the draft flag
set -euo pipefail
cd "$(dirname "$0")/.."

slug="${1:?usage: $0 <slug>  (available: $(ls content/blog/drafts/ 2>/dev/null | grep -v '^_' | sed 's/\.md$//' | tr '\n' ' '))}"
src="content/blog/drafts/${slug}.md"
dst="content/blog/${slug}.md"

[ -f "$src" ] || { echo "no such draft: $src" >&2; exit 1; }
[ -e "$dst" ] && { echo "already published: $dst" >&2; exit 1; }

sed -E -e '/^draft = true$/d' -e "s/^date = .*/date = $(date +%Y-%m-%d)/" "$src" > "$dst"
rm "$src"

echo "published $dst (date set to today, draft flag removed)"
echo "review it, then commit + push to deploy"
