#!/bin/bash
# Rebrand guard. Runs before every shell command Claude makes in this repo and blocks
# anything that could change the live jambys.com site or destroy work.
# Exit 2 = blocked (Claude sees the message). Exit 0 = allowed.

input=$(cat)
cmd=$(printf '%s' "$input" | grep -oE '"command"[[:space:]]*:[[:space:]]*"([^"\\]|\\.)*"' | head -1)
[ -z "$cmd" ] && exit 0

block() {
  echo "BLOCKED by the rebrand guard: $1. Work stays on the rebrand-2026 branch; anything else is Andrew's job, so tell the user to ask Andrew." >&2
  exit 2
}
has() { printf '%s' "$cmd" | grep -Eq -- "$1"; }

has 'shopify[[:space:]]+theme[[:space:]]+(publish|push|delete|rename|share)' \
  && block "shopify theme publish/push/delete can change the live store"

if has 'git[[:space:]]+push'; then
  has '([[:space:]:+]|refs/heads/)main([[:space:]"]|$)' \
    && block "pushing to main puts changes live on jambys.com"
  has '(--force|--force-with-lease|--delete|--mirror|--all|[[:space:]]-f([[:space:]"]|$)|[[:space:]]-d([[:space:]"]|$))' \
    && block "force, delete and mirror pushes are not allowed"
  branch=$(git -C "${CLAUDE_PROJECT_DIR:-.}" rev-parse --abbrev-ref HEAD 2>/dev/null)
  case "$branch" in
    rebrand-2026|rebrand/*) ;;
    *) block "pushes are only allowed from the rebrand-2026 branch (currently on '$branch')" ;;
  esac
fi

has 'git[[:space:]]+(checkout|switch)[[:space:]]+(-[a-zA-Z-]+[[:space:]]+)*main([[:space:]"]|$)' \
  && block "switching to the main branch is not allowed"
has 'git[[:space:]]+branch[[:space:]]+(-D|-d|-M|-m|--delete|--move)' \
  && block "deleting or renaming branches is not allowed"
has 'git[[:space:]]+(reset[[:space:]]+--hard|clean[[:space:]]+-[a-zA-Z]*f|rebase)' \
  && block "reset --hard, clean -f and rebase can destroy work"
has 'gh[[:space:]]+(pr[[:space:]]+merge|repo[[:space:]]+(edit|delete|rename)|api)' \
  && block "merging pull requests and changing repo settings is Andrew's job"

exit 0
