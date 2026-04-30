# Jambys Theme Project Design

**Date:** 2026-04-30
**Store:** jambys-chillwear.myshopify.com
**Public domain:** jambys.com
**GitHub:** andrewgoble/horizon
**Theme:** Horizon v2.1.5 (live, current theme)
**Local path:** ~/Projects/jambys-theme/

---

## Overview

Workspace for maintaining and improving Jambys' live Shopify Horizon theme. Primary focus: codebase audit, Lighthouse performance review, and fixing known regressions (mobile size selector). All development happens on the `preview` branch; `main` is live and only updated via a deliberate ship workflow.

---

## Branch Model

```
preview ──── all development work (push freely here)
              ↓  (when ready to ship)
backup/YYYY-MM-DD ── created from current main (safety net)
              ↓  (merge preview → main)
main ──────── LIVE · Shopify auto-deploys on every push
```

**`preview` branch:** All development. Push as often as needed. Andrew connects this to a Shopify shadow/preview theme via Shopify admin's GitHub integration (manual step, done once).

**`main` branch:** Live site. Never push directly. Only updated via the ship workflow below.

---

## Ship Workflow

When changes on `preview` are ready to go live:

1. Verify changes look correct on the Shopify preview theme (connected to `preview` branch)
2. Create a dated backup of the current live state:
   ```bash
   git checkout main
   git checkout -b backup/YYYY-MM-DD
   git push origin backup/YYYY-MM-DD
   ```
3. Merge preview into main:
   ```bash
   git checkout main
   git merge preview
   git push origin main
   ```
4. Shopify auto-deploys. Verify on jambys.com.
5. Return to preview branch for continued work:
   ```bash
   git checkout preview
   ```

---

## BANNED Commands — Never Run

- **`git push origin main` directly** — only update main via the ship workflow above
- **`shopify theme publish`** — makes a theme live instantly, bypasses the branch model
- **Shopify editor changes to live theme** — without pulling first and committing the drift
- **Any Shopify Admin API writes** (apps, domain, checkout, DNS) — require per-change written approval

`shopify theme push` is allowed to push to the shadow/preview theme only. Always confirm the theme ID before running.

---

## Shopify Admin Changes — Per-Change Approval Required

Each of these requires explicit approval before execution — session-level blanket approval does NOT apply:

- App installs or removals
- Payment, checkout, shipping, or tax settings
- Domain or DNS changes
- Any Shopify Admin API write call outside theme files

---

## Session-Start Ritual (Every Session)

Run before any other work:

```bash
# On preview branch — check for drift from Shopify editor edits
shopify theme pull --store jambys-chillwear --theme <preview-theme-id> --path .
git diff
```

If `git diff` is non-empty: someone edited the theme via the Shopify editor. Commit the drift before proceeding:

```bash
git add -A
git commit -m "Theme drift: <describe what changed>"
```

Then load Liquid MCP if doing any Liquid work:
```
learn_shopify_api(api: "liquid")
```

---

## MCP + Validation Gates

**Before** writing any Liquid or theme JSON:
- Call `mcp__shopify-dev-mcp__search_docs_chunks` for the specific section/block/filter/schema being built
- Reference `~/Projects/aspera/theme/sections/` for real Horizon patterns

**After** writing any theme file:
- Call `mcp__shopify-dev-mcp__validate_theme` — fix ALL errors before proceeding
- Run `shopify theme check --path .` — zero warnings threshold

---

## 3-Check Rule — Mandatory Before Any Infra/Config Recommendation

Before recommending any Shopify admin or infrastructure change:

1. **Current-state check** — verify current state first (`shopify theme list`, Shopify admin) — never assume
2. **Evidence check** — does the evidence directly support the recommendation, or could it be a measurement artifact?
3. **Repo-grep check** — is there a local code fix that solves this without a backend change?

Recommendations that fail any check must be flagged as unverified.

---

## Horizon Silent-Failure Rules

These will break without an obvious error message:

| Never | Always use instead |
|-------|-------------------|
| `{% for block in section.blocks %}` | `{% content_for 'blocks' %}` |
| `{% include %}` | `{% render %}` |
| `img_url` / `img_tag` | `image_url` / `image_tag` |
| Liquid vars inside `{% stylesheet %}` | `{% style %}` for dynamic CSS |
| `{% doc %}` in sections | `{% doc %}` in snippets and static blocks only |

Always:
- `{{ block.shopify_attributes }}` on block root elements
- `t:` prefix in schema JSON labels → keys go in `en.default.schema.json`
- `{{ 'key' | t }}` filter keys → `en.default.json`

---

## CLI Reference

> **Note:** Replace `<preview-theme-id>` with the Shopify theme ID once Andrew connects the `preview` branch to a shadow theme in Shopify admin. Run `shopify theme list --store jambys-chillwear` to find the ID after setup.

```bash
# Local dev against preview theme
shopify theme dev --store jambys-chillwear --path .

# Push to preview/shadow theme only (never live)
shopify theme push --store jambys-chillwear --theme <preview-theme-id> --path .

# Pull from preview theme (drift check)
shopify theme pull --store jambys-chillwear --theme <preview-theme-id> --path .

# Lint
shopify theme check --path .

# List all themes + their IDs
shopify theme list --store jambys-chillwear
```

---

## Reference

- Aspera Horizon patterns: `~/Projects/aspera/theme/sections/`
- StickyGolf theme rules: `~/Projects/stickygolf-theme/CLAUDE.md`
- Shopify Liquid MCP conversationId: load fresh each session via `learn_shopify_api(api: "liquid")`

---

## First Session Plan

1. Clone `andrewgoble/horizon` → `~/Projects/jambys-theme/`
2. Create `preview` branch, push to origin
3. Run drift check: `shopify theme pull` + `git diff` vs Apr 15 last save — document everything that changed
4. Run Lighthouse audit on jambys.com (mobile + desktop) — record scores
5. Investigate mobile size selector regression — sizes visually smaller on mobile (likely CSS regression in a recent theme edit)
6. Prioritize fixes from audit + regression
