#!/usr/bin/env bash
# scaffold a new local draft (never pushed): ./scripts/new-draft.sh "my essay title"
# add --note for the lighter tier:          ./scripts/new-draft.sh "quick thought" --note
set -euo pipefail
cd "$(dirname "$0")/.."

title="${1:?usage: $0 \"essay title\" [--note]}"
kind="essay"
[ "${2:-}" = "--note" ] && kind="note"
slug=$(echo "$title" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g')
file="content/blog/drafts/${slug}.md"

[ -e "$file" ] && { echo "already exists: $file" >&2; exit 1; }

cat > "$file" <<EOF
+++
title = "$title"
description = ""
date = $(date +%Y-%m-%d)
draft = true

[taxonomies]
tags = []

[extra]
$( [ "$kind" = "note" ] && echo 'kind = "note"
toc = false' || echo 'toc = true' )
+++

EOF

echo "created $file"
echo "preview with: zola serve --drafts"
