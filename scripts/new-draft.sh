#!/usr/bin/env bash
# scaffold a local-only draft: ./scripts/new-draft.sh "title" [--note]
set -euo pipefail
cd "$(dirname "$0")/.."
title="${1:?usage: new-draft.sh \"title\" [--note]}"
kind=""
[[ "${2:-}" == "--note" ]] && kind="note"
slug="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | iconv -f utf8 -t ascii//TRANSLIT 2>/dev/null | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')"
file="src/blog/drafts/${slug}.md"
[[ -e "$file" ]] && { echo "exists: $file"; exit 1; }
mkdir -p src/blog/drafts
{
  echo "---"
  echo "title: \"$title\""
  echo "date: $(date +%Y-%m-%d)"
  echo "description: \"\""
  echo "tags: []"
  [[ -n "$kind" ]] && echo "kind: note"
  echo "math: false"
  echo "draft: true"
  echo "---"
  echo
  echo "first paragraph."
} > "$file"
echo "→ $file   (preview with: npm run dev:drafts)"
