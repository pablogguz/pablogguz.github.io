#!/usr/bin/env bash
# move a draft into posts/, stamp today's date, drop the draft flag: ./scripts/publish-draft.sh <slug>
set -euo pipefail
cd "$(dirname "$0")/.."
slug="${1:?usage: publish-draft.sh <slug>}"
src="src/blog/drafts/${slug}.md"
dst="src/blog/posts/${slug}.md"
[[ -f "$src" ]] || { echo "no draft: $src"; exit 1; }
[[ -e "$dst" ]] && { echo "already published: $dst"; exit 1; }
sed -E "s/^date: .*/date: $(date +%Y-%m-%d)/; /^draft: true$/d" "$src" > "$dst"
rm "$src"
echo "→ $dst   (now: git add, commit, push)"
