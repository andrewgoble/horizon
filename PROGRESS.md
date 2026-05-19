## Current State
**Last session:** 2026-05-19 — S9: Full theme audit + Shoplift/Heatmap removal (code cleaned, apps need admin uninstall)
**Next:**
- Uninstall Heatmap + Shoplift in Shopify admin (`/admin/apps`) if not done
- GA4 duplicate: open GTM-PFQG442, delete GA4 tag if present (fires to G-RGWNX60RXQ)
- Duplicate FB pixel: check if FB pixel in GTM AND as native Shopify pixel — remove one
- Typekit font-display:swap (Adobe Fonts dashboard — kit hxg4nit)
- Re-run Lighthouse after admin cleanup to measure improvement
**Branch:** develop / clean (pushed, preview theme deploying)

## Next Session Kickoff
**Mode:** shallow
**First action:** Confirm Heatmap + Shoplift uninstalled in admin, then run Lighthouse to measure improvement
**Open questions:** none
**Decisions pending:** Replo templates (12 pages) — keep or delete? Wonderment — still in use?
**Ready plan:** none

---

## Session 1 — 2026-04-30

**Work done:**
- Cloned andrewgoble/horizon → ~/Projects/jambys-theme/
- Created preview branch, pushed to origin (bobbyteenager89 added as collaborator on andrewgoble/horizon)
- Added CLAUDE.md with live-site guardrails, branch model, MCP gates
- Added PROGRESS.md, .gitignore (.superpowers/ ignored), pre-push hook (blocks preview→main)
- Drift check: Apr 15-17 commits = Shoplift A/B framework + editor saves (not upstream Horizon). Already in preview.
- Size selector regression found: commit 57de4dd — see docs/audits/2026-04-30-size-selector-bug.md
- Lighthouse baseline: see docs/audits/2026-04-30-lighthouse-summary.md

**Lighthouse scores (jambys.com, 2026-04-30):**
| Category | Mobile | Desktop |
|----------|--------|---------|
| Performance | 31 | 61 |
| Accessibility | 84 | 81 |
| Best Practices | 50 | 50 |
| SEO | 100 | 100 |

**Top fixes by priority:**
1. Size selector mobile regression (snippets/variant-main-picker.liquid ~line 533)
2. Typekit render-blocking — enable font-display:swap in Adobe Fonts dashboard
3. Third-party JS bloat — GTM duplicates, Alia, Loop Returns loading eagerly
4. Console errors / MissingRefError in anchored-popover-component
5. No hero image preload (LCP: 6.0s mobile)

---

## Session 2 — 2026-04-30

### Accomplished
- Discovered `develop` branch already existed and was connected to Shopify preview theme (Graft Studio Nov 26 2025 work)
- Migrated all work from `preview` to `develop` via cherry-pick (8 commits)
- Rewrote CLAUDE.md: GitHub-only workflow (no Shopify CLI push/pull needed), correct branch names
- Deleted `preview` branch (local + origin)
- Fixed mobile size selector: removed Graft Studio's `font-size: 11px !important` + `min-width/height: auto` overrides from `snippets/variant-main-picker.liquid` (bug was live on jambys.com since Nov 26 2025)
- Merged `main` into `develop` — pulled in 80 commits of live content (announcement bar, etc.) so preview theme matches live site

### Files Modified
| File | Changes |
|------|---------|
| `CLAUDE.md` | Rewrote: GitHub-only workflow, removed CLI push/pull, removed theme ID placeholder |
| `snippets/variant-main-picker.liquid` | Removed Graft Studio mobile overrides shrinking size selector |
| `snippets/shoplift.liquid` | Conflict resolved (timestamp only) — took main's version |

### Next Steps
- [x] Verify size selector fix on preview theme (mobile) — carried into S3

---

## Session 3 — 2026-05-01

### Accomplished
- Pushed S2 commit to origin/develop (was 1 commit ahead)
- Fixed mobile size selector layout: switched to horizontal scroll — `flex-wrap: nowrap` + `overflow-x: auto` + `scrollbar-width: none`
- Fixed whole-page scroll: added `max-width: 100%` to contain scroll within the row
- Fixed swatch outline clipping: `overflow-x: auto` was applied to color row too (both share `.variant-option--buttons`), implicitly clipping `overflow-y` and cropping stroke on 3 sides. Fixed with `:not(.variant-option--swatches)` selector.
- Tightened mobile gap to `6px` so 3XL peeks into view hinting at scroll
- Added `overflow: visible` to `.variant-option__button-label--has-swatch` for full stroke display
- Updated CLAUDE.md: "shadow theme" → "preview theme", added Jambys Chrome browser profile rule

### Files Modified
| File | Changes |
|------|---------|
| `snippets/variant-main-picker.liquid` | Horizontal scroll, gap tighten, swatch overflow fix, :not() scoping |
| `CLAUDE.md` | "preview theme" terminology, Jambys Chrome browser note |

---

## Session 4 — 2026-05-05

### Accomplished
- Pushed develop to origin — S3 fixes deploying to preview theme

### Files Modified
_(none — push only)_

---

## 2026-05-06 — Session 5: Brief session — no changes

### Accomplished
- Confirmed next steps (preview theme verification + ship to main)
- No code changes this session

---

## 2026-05-07 — Session 6: Mobile swatch horizontal scroll

### Accomplished
- Extended mobile horizontal scroll to color swatches (was excluded via `:not(.variant-option--swatches)`)
- Debugged 3 cascading issues over 4 commits:
  1. **Outline clipping top/bottom** — `overflow-x: auto` forces `overflow-y: hidden`; fixed with `padding-block: 8px` (outline paints within padding box)
  2. **Circles shrinking** — swatch labels had `flex-shrink: 1` (default); size buttons have `flex: 0 0 ...` but swatches only override `flex-basis`. Fixed with `flex-shrink: 0` on `.variant-option__button-label--has-swatch` in mobile scroll context
  3. **Cramped swatches** — hardcoded `gap: 6px` from size rule was applied to swatches; restored `gap: var(--gap-sm)` (0.7rem / 11.2px)
- Used browser JS inspection (`getComputedStyle`) to confirm computed values during debugging
- Shopify webhook stalled mid-session (34min gap) — pushed 3× before sync resumed

### Files Modified
| File | Changes |
|------|---------|
| `snippets/variant-main-picker.liquid` | Mobile swatch scroll: padding-block, flex-shrink, gap (4 commits) |

### Commits
- `4f8b0e1` Mobile: extend horizontal scroll to color swatches (same as sizes)
- `9ae4691` fix: swatch scroll — padding-block to prevent outline clipping on overflow-x
- `9c1f155` fix: flex-shrink: 0 on swatch labels in mobile scroll
- `13369c4` fix: swatch scroll — restore gap-sm, increase padding-block to 8px for outline clearance

### Next Steps
- [x] Verify latest swatch fix on preview (scroll + ring + spacing)
- [x] Ship develop → main if verified
- [ ] Typekit font-display:swap (Adobe Fonts dashboard — no code)
- [x] Third-party JS audit — GTM duplicates, Alia, Loop Returns

---

## 2026-05-11 — Session 7: Ship to main + JS audit + Heatmap removal

### Accomplished
- Verified S6 swatch fix on preview theme: ring fully visible all sides, gap 11.2px, flex-shrink 0, overflow-x auto — all confirmed via `getComputedStyle`
- Ran ship workflow: created `backup/2026-05-07`, merged develop → main (fast-forward, 7 files), pushed to origin/main — live on jambys.com
- Full third-party JS audit via live network scan + PSI: identified Alia (4,851ms), duplicate FB pixel, GTM+gtag GA4 double-load, Heatmap (940ms, 3x loads), Loop Returns (112KB on every PDP)
- Lighthouse scores: mobile 30 (LCP 7.7s, TBT 1,890ms, TTI 30.9s) / desktop 56
- Removed Heatmap.com inline script from `layout/theme.liquid` — committed + pushed to develop
- Explained Sofia Pro / Sofia Sans font picker workaround (Adobe Fonts loads real font; picker uses standard placeholder)

### Files Modified
| File | Changes |
|------|---------|
| `layout/theme.liquid` | Removed Heatmap.com inline script (~940ms JS execution, loaded 3×) |

### Commits
- `bc3a4ed` perf: remove Heatmap.com script (940ms JS execution, 3x loads)

### Next Steps
- [ ] Heatmap: uninstall app in Shopify Admin (removes app embed — script still loads without this)
- [ ] GTM audit: open GTM-PFQG442, delete GA4 tag firing to G-RGWNX60RXQ (Shopify native pixel handles GA4)
- [ ] FB pixel dedup: remove one instance (GTM tag vs native Shopify pixel)
- [ ] Typekit font-display:swap — Adobe Fonts dashboard, kit hxg4nit
- [ ] Alia: contact for async/deferred loading option
- [ ] Re-run Lighthouse after admin cleanup to measure improvement

---

## 2026-05-19 — Session 8: Cart drawer upsells — remove, toggle, Shopify Recommendations API

### Accomplished
- Removed "You may also like" static product carousel from cart drawer (`snippets/cart-drawer.liquid`) — shipped to main
- Added `enable_cart_upsells` checkbox to theme settings (`config/settings_schema.json`) — default off
- Replaced static curated product list with Shopify Recommendations API: tries `intent=complementary` first, falls back to `intent=related` if no results (`assets/cart-upsells.js`)
- Removed bad `collections.all` fallback from `sections/cart-upsells.liquid`
- Loaded `cart-upsells.js` via `<script type="module">` in cart drawer snippet
- Cart drawer now renders `<cart-upsells>` custom element keyed on `cart.items.first.product_id`
- All 3 changes shipped to main; toggle is off so no visible change on live site

### Files Modified
| File | Changes |
|------|---------|
| `snippets/cart-drawer.liquid` | Removed static upsells block + CSS; added `<cart-upsells>` element + script load |
| `assets/cart-upsells.js` | Refactored to complementary→related fallback via `#fetchIntent()` |
| `sections/cart-upsells.liquid` | Removed `collections.all` fallback — only renders real recommendations |
| `config/settings_schema.json` | Added `enable_cart_upsells` checkbox (default: false) |

### Commits
- `3b17f04` feat: remove cart drawer "You may also like" upsells module
- `70de3ac` feat: add enable_cart_upsells toggle to theme settings
- `5be9807` feat: cart drawer upsells now use Shopify Recommendations API

### Next Steps
- [ ] Configure complementary products in Shopify Admin → Apps → Search & Discovery → Product recommendations → Complementary products
- [ ] Toggle on `enable_cart_upsells` in Theme Settings → Cart and verify in preview
- [ ] Heatmap: uninstall app in Shopify Admin
- [ ] GTM audit: open GTM-PFQG442, delete GA4 tag firing to G-RGWNX60RXQ
- [ ] FB pixel dedup: remove one instance (GTM tag vs native Shopify pixel)
- [ ] Typekit font-display:swap — Adobe Fonts dashboard, kit hxg4nit
- [ ] Alia: contact for async/deferred loading option
- [ ] Re-run Lighthouse after admin cleanup to measure improvement

---

## 2026-05-19 — Session 9: Full audit + Shoplift/Heatmap cleanup

### Accomplished
- Full third-party script audit of jambys-theme
- Identified Heatmap (app ScriptTag, `sid=600`) as primary Lighthouse drag — confirmed for uninstall
- Identified Shoplift as A/B testing app injected via `snippets/shoplift.liquid`
- Removed `{% render 'shoplift' %}` from `layout/theme.liquid`
- Removed duplicate/hardcoded Typekit `preconnect` + `stylesheet` from `theme.liquid` (was firing unconditionally; `fonts.liquid` already handles it conditionally via settings)
- Identified additional theme inventory: 12 Replo page templates, 2 Wonderment sections, 16 Replo snippet chunks — noted for future review
- Pushed cleanup commit to develop; preview theme auto-deploying

### Files Modified
| File | Changes |
|------|---------|
| `layout/theme.liquid` | Removed Shoplift render block + duplicate Typekit font load (11 lines removed) |

### Commits
- `32a8495` cleanup: remove Shoplift render + deduplicate Typekit font load

### Next Steps
- [ ] Uninstall Heatmap app in Shopify Admin (removes ScriptTag + all heatmap.com network calls)
- [ ] Uninstall Shoplift app in Shopify Admin (code already removed from theme)
- [ ] GTM audit: open GTM-PFQG442, delete GA4 tag firing to G-RGWNX60RXQ
- [ ] FB pixel dedup: check GTM vs native Shopify pixel — remove one
- [ ] Typekit font-display:swap — Adobe Fonts dashboard, kit hxg4nit
- [ ] Replo templates: audit 12 Replo page templates (check in Shopify Admin → Pages) — delete if not live
- [ ] Re-run Lighthouse after Heatmap + Shoplift uninstalled to measure improvement
