# Jambys Theme — Project Rules

Maintenance and improvement of Jambys' live Horizon theme at jambys.com.

---

## LIVE SITE GUARDRAILS — HARD STOPS

### Deploy workflow — ONLY correct method
All dev work on `preview` branch. `git push origin main` deploys live instantly.
Only update main via the ship workflow below.

### BANNED commands — Never run under any circumstances
- **`shopify theme publish`** — makes a theme live instantly, no exceptions
- **`git push origin main` directly** — ship workflow only (see below)
- **Shopify editor changes to live theme** — without pulling first and committing drift

### Shopify admin changes — require per-change written approval
Session-level blanket approval does NOT apply:
- App installs or removals
- Payment, checkout, shipping, or tax settings
- Domain or DNS changes
- Any Shopify Admin API write call outside theme files

---

## Store
- Store: `jambys-chillwear.myshopify.com`
- Public domain: `jambys.com`
- GitHub: `andrewgoble/horizon`
- Theme: Horizon v2.1.5
- Local path: `~/Projects/jambys-theme/`

## Branch model
- `preview` — all development. Push freely.
- `main` — LIVE. Shopify auto-deploys on every push.
- `backup/YYYY-MM-DD` — created from main before every ship.

## ⚠️ Shopify auto-updates
Shopify pushes Horizon theme updates directly to `main` via the fork relationship.
This means `main` can change without any action on our part. Always pull `main`
before starting ship workflow to avoid merge conflicts or overwriting upstream changes.

## Ship workflow
1. Verify changes on Shopify preview theme (connected to `preview` branch by Andrew)
2. Pull latest main first: `git checkout main && git pull origin main`
3. Create backup: `git checkout -b backup/YYYY-MM-DD && git push origin backup/YYYY-MM-DD`
4. Merge: `git checkout main && git merge preview && git push origin main`
5. Verify on jambys.com. Return to `preview`.

## Preview theme
**NOT YET CONNECTED.** Andrew connects `preview` branch to a Shopify shadow theme
via Shopify admin → Themes → Add theme → Connect from GitHub → select `preview` branch.
Update the ID here when done: `PREVIEW_THEME_ID=`

---

## Session Start — Every Session

```bash
# On preview branch — drift check
shopify theme pull --store jambys-chillwear --theme PREVIEW_THEME_ID --path .
git diff
```

If `git diff` is non-empty: commit before other work:
```bash
git add -A && git commit -m "Theme drift: <what changed>"
```

Load MCP if doing Liquid work:
`learn_shopify_api(api: "liquid")`

---

## Shopify AI Toolkit — MCP Gates

Before writing ANY Liquid or theme JSON:
- `mcp__shopify-dev-mcp__search_docs_chunks` for the section/block/filter

After writing ANY theme file:
- `mcp__shopify-dev-mcp__validate_theme` — fix ALL errors before proceeding
- `shopify theme check --path .` — zero warnings threshold

Reference patterns: `~/Projects/aspera/theme/sections/`

---

## Horizon Silent-Failure Rules

| Never | Always use instead |
|-------|-------------------|
| `{% for block in section.blocks %}` | `{% content_for 'blocks' %}` |
| `{% include %}` | `{% render %}` |
| `img_url` / `img_tag` | `image_url` / `image_tag` |
| Liquid vars inside `{% stylesheet %}` | `{% style %}` for dynamic CSS |
| `{% doc %}` in sections | `{% doc %}` in snippets and static blocks only |

Always:
- `{{ block.shopify_attributes }}` on block root elements
- `t:` prefix in schema JSON labels → `en.default.schema.json`
- `{{ 'key' | t }}` filter keys → `en.default.json`

---

## 3-Check Rule — Before Any Infra Recommendation

1. **Current-state check** — verify current state first, never assume
2. **Evidence check** — direct support, or measurement artifact?
3. **Repo-grep check** — local code fix before backend change?

---

## CLI Reference

```bash
# Dev locally (preview theme)
shopify theme dev --store jambys-chillwear --path .

# Push to preview/shadow theme only — confirm theme ID first
shopify theme push --store jambys-chillwear --theme PREVIEW_THEME_ID --path .

# Pull (drift check)
shopify theme pull --store jambys-chillwear --theme PREVIEW_THEME_ID --path .

# Lint
shopify theme check --path .

# List all themes + IDs
shopify theme list --store jambys-chillwear
```

---

## Reference
- Aspera Horizon patterns: `~/Projects/aspera/theme/sections/`
- StickyGolf rules: `~/Projects/stickygolf-theme/CLAUDE.md`
- Design spec: `docs/superpowers/specs/2026-04-30-jambys-theme-project-design.md`
