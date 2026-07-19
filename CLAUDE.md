# Jambys Theme — Project Rules

Maintenance and improvement of Jambys' live Horizon theme at jambys.com.

---

## LIVE SITE GUARDRAILS — HARD STOPS

### Deploy workflow — ONLY correct method
All dev work on `develop` branch. `git push origin main` deploys live instantly.
Only update main via the ship workflow below.

### BANNED commands — Never run under any circumstances
- **`shopify theme publish`** — makes a theme live instantly, no exceptions
- **`git push origin main` directly** — ship workflow only (see below)

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
- `develop` — all development. Push freely. Shopify auto-deploys to **preview theme** via GitHub integration.
- `main` — LIVE. Shopify auto-deploys to jambys.com via GitHub integration.
- `backup/YYYY-MM-DD` — created from main before every ship.

## Browser
- **Always use the Jambys Chrome browser profile** for Shopify admin and preview theme verification.
- Switching browsers: use `switch_browser` MCP tool — broadcast goes to all Chrome instances with the extension. Andrew clicks "Connect" in the Jambys browser.

## ⚠️ Shopify editor saves commit to git
When anyone edits the live or develop themes in the Shopify editor, Shopify
automatically commits those changes back to the connected GitHub branch.
These appear as "Update from Shopify for theme horizon/develop" commits.
Always pull before working to catch them.

## Ship workflow
1. Verify changes on Shopify develop theme (connected to `develop` branch)
2. Pull latest: `git checkout main && git pull origin main && git checkout develop && git pull origin develop`
3. Create backup: `git checkout main && git checkout -b backup/YYYY-MM-DD && git push origin backup/YYYY-MM-DD`
4. Merge: `git checkout main && git merge develop && git push origin main`
5. Verify on jambys.com. Return to `develop`.

---

## Session Start — Every Session

```bash
# On develop — catch any Shopify editor saves
git checkout develop && git pull origin develop
git log --oneline -5
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
# Lint only (no auth needed)
shopify theme check --path .
```

---

## Reference
- Aspera Horizon patterns: `~/Projects/aspera/theme/sections/`
- StickyGolf rules: `~/Projects/stickygolf-theme/CLAUDE.md`
- Design spec: `docs/superpowers/specs/2026-04-30-jambys-theme-project-design.md`

---

## Gotchas

- **Aftersell checkout upsell is dead — Shopify Plus was downgraded to Advanced.** The "Upsell Widget" block still sits in the active checkout profile (Admin → Settings → Checkout → Edit), but Aftersell's checkout-extension placement requires Plus. Aftersell's own dashboard shows a "Shopify Plan Downgrade Detected" banner and $0 checkout revenue (vs. $302 post-purchase / $60 thank-you / $40 Rokt Network over the last 30 days). This is a separate system from the hand-built cart-drawer upsell — don't conflate them when debugging "the upsell isn't working."
- **Cart-drawer upsell is hand-built, not an app.** `sections/cart-upsells.liquid` + `assets/cart-upsells.js`, pulling from Shopify's Section Rendering / Recommendations API. Fixed twice: S32 (2026-07-02, module-level cache + observedAttributes) and a follow-up race-condition fix on 2026-07-17 (commit d406960, landed by a parallel session — `attributeChangedCallback` firing on initial element upgrade raced `connectedCallback` via a shared AbortController, silently killing the render on normal page loads). Full write-up: `learnings-shopify.md` under "Horizon Custom Element Cache."
- **Footer had a stray literal "ok"** rendering before the copyright line since Sept 2025 (`blocks/_footer-copyright.liquid`) — fixed S35 (2026-07-19, commit 52a0ddc). If you see other odd literal text in shared blocks, check for similar copy-paste artifacts.

Global learnings: `~/.claude/projects/-Users-andrew/memory/learnings/` — relevant when implementing or debugging in documented areas; match `Module:`/`Tags:` (Shopify/Horizon-specific: `learnings-shopify.md`; general debugging process: `learnings-process.md`).
