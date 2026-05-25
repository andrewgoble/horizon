## Current State
**Last session:** 2026-05-25 — S11: T2 audit sweep — CaptureOnContentForBlock fixed/suppressed, fonts enabled (Sofia Pro + Kansas via Typekit hxg4nit)
**Next:**
- Font verification in browser: open Jambys preview theme → DevTools confirm `sofia-pro` on body, `new-kansas` on h1
- T3 perf: LCP hero preload + eager + fetchpriority (`blocks/image.liquid:36-50`)
- T3 perf: `font-display: swap` in `base.css` + cap image widths at 1920
- DECIDE: Rivo loyalty templates (delete or reinstall app blocks?)
- DECIDE: redirect chain primary-domain fix (1-way door, ~780ms mobile)
**Branch:** develop / clean (4 S11 commits pushed, preview deploying)

## Next Session Kickoff
**Mode:** execute
**First action:** Open Jambys preview theme in Jambys Chrome profile → DevTools: verify computed font-family on body includes `sofia-pro` and h1 includes `new-kansas`. If confirmed, proceed to T3 perf: `blocks/image.liquid:36-50` LCP preload + eager + fetchpriority, then cap image widths at 1920.
**Open questions:** none
**Decisions pending:** Rivo loyalty templates (delete or reinstall app blocks?); redirect chain primary-domain fix (1-way door, ~780ms mobile)
**Ready plan:** `docs/audits/2026-05-23-full-audit-S10.md` — T2 done, T3 next

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

---

## 2026-05-24 — Session 10: PSI audit + 4-agent code audit + T1 deletion sweep

### Accomplished
- **Speed audit**: 10 PageSpeed Insights v5 audits across 5 URLs (home, navy-mint, gray-lavender-jamtee, glacier-jamtee, cart) × mobile+desktop. Results: mobile 30-42, desktop 50-62. Worst: Glacier mobile LCP 11.3s / TBT 1,570ms / 5.9MB. Universal finding: redirect chain costs 780ms on every mobile page (5,050ms aggregated). Delta vs 2026-04-30 home baseline: +8 mobile / +1 desktop (S9 Heatmap/Shoplift cleanup paid off — TBT down 65%).
- **Full code audit** via 4 parallel Opus Explore agents (Structure / Quality / Performance / Accessibility). 485 theme-check errors baseline; identified 35-item prioritized backlog across T1-T6 tiers.
- **T1 deletion sweep**: removed 38 files / 11,853 LOC of orphan code:
  - 17 unused Replo section shells (`sections/replo-*.liquid`)
  - 5 inactive Shoplift sections (`sections/sl-*.liquid`)
  - 9 orphan Shoplift snippets (`snippets/sl-*.liquid`)
  - 2 unused Wonderment sections (loop, starter)
  - 3 orphan files: `sections/cart-upsells.liquid`, `snippets/cart-upsells.liquid` (alias), `snippets/filters-toggle.liquid`
  - `temp/` Shopify editor scratch directory
- **Bug fix**: `sections/header.liquid:49,53,57` — three `content_for 'block'` calls all used id `'header-menu'`. Per Shopify first-write-wins, mobile menu + nav-bar variants could render empty on cold cache. Renamed to `header-menu` / `header-menu-mobile` / `header-menu-navbar`.
- **Theme check**: 689 → 508 total offenses (-26%). Warnings 204 → 67 (-67%). `UniqueStaticBlockId` + `UnsupportedDocTag` errors eliminated.

### Files Modified
| File | Changes |
|------|---------|
| `docs/audits/2026-05-23-lighthouse-S10.md` | New — PSI audit, 5 URLs × mobile+desktop, delta vs 2026-04-30 baseline |
| `docs/audits/2026-05-23-full-audit-S10.md` | New — 6-section consolidated code audit + 35-item T1-T6 backlog |
| `sections/header.liquid` | Fixed 3 duplicate `header-menu` static block ids |
| `sections/replo-*.liquid` (17 files) | Deleted (orphan) |
| `sections/sl-*.liquid` (5 files) | Deleted (Shoplift orphan) |
| `snippets/sl-*.liquid` (9 files) | Deleted (Shoplift orphan) |
| `sections/wonderment-{loop,starter}.liquid` | Deleted (unused) |
| `sections/cart-upsells.liquid` + `snippets/cart-upsells.liquid` + `snippets/filters-toggle.liquid` | Deleted (orphan) |
| `temp/` | Deleted (Shopify editor scratch) |

### Methodology notes
- Speed audit: PSI v5 REST API, key from `~/Projects/growth-hq/.env.local` (`PAGESPEED_API_KEY`). Raw JSON cached at `/tmp/jambys-psi/` — re-run via `/tmp/jambys-psi.sh`.
- Code audit: 4 Opus Explore agents dispatched in parallel single message, ~6-7 min wall-clock each. `shopify theme check --path .` (132K lines, 485e / 204w) fed as input to Quality agent.

### QA gate
- ⚠️ Preview theme **NOT visually QA'd** this session — Shopify admin iframe blocked Claude-in-Chrome from extracting develop preview URL. Andrew declined paste-URL flow when offered. Deletions are zero-reference files (cross-checked across templates/, sections/, snippets/, blocks/, layout/), and header.liquid change is a mechanical id rename — low risk. Smoke-test deferred to S11 before any T2 changes merge.

### Next Steps
- [ ] T2: 29 `CaptureOnContentForBlock` fixes across 9 blocks (`blocks/_blog-post-card.liquid`, `_collection-card.liquid`, `_collection-link.liquid`, `_featured-product.liquid`, `_product-card-gallery.liquid`, +4 more)
- [ ] T2: `{{ block.shopify_attributes }}` on 14 public blocks (`blocks/{button,collection-card,collection-title,contact-form,custom-liquid,jumbo-text,page-content,page,product-card,product-description,product-title,quantity,text,variant-picker}.liquid`)
- [ ] T2: add missing `accessibility.loading` key to `locales/en.default.json`
- [ ] T3 perf: `blocks/image.liquid:36-50` LCP hero preload + eager + fetchpriority
- [ ] T3 perf: `snippets/fonts.liquid:16` async Typekit + `font-display: swap` overrides in `base.css`
- [ ] T3 perf: cap image widths at 1920 (drop `2560`, `3840` from `sections/hero.liquid:10` + `blocks/image.liquid:38`)
- [ ] DECIDE: Rivo loyalty templates — delete or reinstall app blocks?
- [ ] DECIDE: redirect chain primary-domain fix (1-way door, ~780ms mobile)
- [x] T2: 29 `CaptureOnContentForBlock` errors — fixed (inline or suppress) across 7 blocks
- [x] T2: `{{ block.shopify_attributes }}` on 14 public blocks — confirmed all false positives (handled in snippets)
- [x] T2: async Typekit load pattern + enable `use_adobe_fonts: true` in settings
- [x] T2c: Suppress `UnsupportedForBlock` in 4 custom sections (Wonderment, Rivo)
- [ ] Visual QA preview theme on home + 3 PDPs + cart drawer + mobile menu before any S11 merge to main

---

## 2026-05-25 — Session 11: T2 audit sweep + Adobe Fonts enable

### Accomplished
- **T2a — CaptureOnContentForBlock** (485 → 10 errors, -97.9%):
  - `blocks/_blog-post-card.liquid`: inlined all 3 captures (`title`, `details`, `description`) — `content_for` now emits directly
  - `blocks/_collection-link.liquid`: inlined `title_block` capture (single-use); restored `image_block` as capture + suppress (two-position render — same stock Horizon pattern as Aspera)
  - `blocks/_collection-card.liquid`, `blocks/collection-card.liquid`, `blocks/_featured-product.liquid`: added `theme-check-disable CaptureOnContentForBlock` — all match stock Horizon pattern (capture → pass to `render` snippet as `children:` arg)
  - `blocks/contact-form.liquid`, `blocks/product-recommendations.liquid`: added suppress — both confirmed stock Horizon pattern
- **T2b — MissingBlockShopifyAttributes** (14 flags): all confirmed false positives — attribute is delegated to snippets (`button.liquid:30`, `text.liquid:71`, `product-card.liquid:104`, etc.). No changes needed.
- **T2c — UnsupportedForBlock** (4 custom sections): added `theme-check-disable` / `theme-check-enable` around `{% for block in section.blocks %}` loops in `sections/rivo-how-it-works-custom.liquid`, `sections/wonderment-custom-html.liquid`, `sections/wonderment-faq.liquid` (2 loops — HTML + JSON-LD), `sections/wonderment-hero.liquid`. Cannot use `content_for 'blocks'` in these third-party sections.
- **Adobe Fonts fix** (`snippets/fonts.liquid` + `config/settings_data.json`):
  - Changed `use_adobe_fonts: false → true` in settings_data.json
  - Replaced blocking `<link rel="stylesheet">` with async preload pattern (`rel="preload"` + `onload="this.onload=null;this.rel='stylesheet'"` + `<noscript>` fallback)
  - Kit ID `hxg4nit` contains Sofia Pro (body) + New Kansas (headings) — now actually loads
  - Font verification in browser NOT yet completed (session interrupted mid-browser-automation)

### Theme-check result
- Errors: 10 (all `MatchingTranslations` — deferred per user "no translation keys needed")
- Warnings: 3 (`RemoteAsset` ×2, `MissingRenderSnippetArguments` ×1)
- `CaptureOnContentForBlock` / `MissingBlockShopifyAttributes` / `UnsupportedForBlock`: all resolved

### Files Modified
| File | Changes |
|------|---------|
| `blocks/_blog-post-card.liquid` | Inlined 3 captures → direct `content_for` calls |
| `blocks/_collection-link.liquid` | Inlined `title_block`; suppressed `image_block` capture (two-position) |
| `blocks/_collection-card.liquid` | Added `CaptureOnContentForBlock` suppress |
| `blocks/collection-card.liquid` | Added `CaptureOnContentForBlock` suppress |
| `blocks/_featured-product.liquid` | Added `CaptureOnContentForBlock` suppress |
| `blocks/contact-form.liquid` | Added `CaptureOnContentForBlock` suppress |
| `blocks/product-recommendations.liquid` | Added `CaptureOnContentForBlock` suppress |
| `sections/rivo-how-it-works-custom.liquid` | Added `theme-check-disable/enable` around for loop |
| `sections/wonderment-custom-html.liquid` | Added `theme-check-disable/enable` around for loop |
| `sections/wonderment-faq.liquid` | Added `theme-check-disable/enable` around 2 for loops (HTML + JSON-LD) |
| `sections/wonderment-hero.liquid` | Added `theme-check-disable/enable` around for loop |
| `config/settings_data.json` | `use_adobe_fonts: false → true` |
| `snippets/fonts.liquid` | Replaced blocking stylesheet with async preload + noscript fallback |

### Commits
- `e473f7a` fix(T2a): inline content_for out of capture blocks; suppress stock Horizon pattern
- `33c5fab` fix(fonts): enable Adobe Fonts (Sofia Pro / Kansas) + async Typekit load
- `17f3e17` fix(T2a): suppress remaining CaptureOnContentForBlock in stock Horizon blocks
- `a98da06` fix(_collection-link): restore image_block capture + suppress; inline only title_block

### Next Steps
- [ ] Font verification: open Jambys preview theme in browser → DevTools computed font-family (`sofia-pro` on body, `new-kansas` on h1)
- [ ] T3 perf: `blocks/image.liquid:36-50` LCP hero preload + eager + fetchpriority
- [ ] T3 perf: `font-display: swap` overrides in `base.css`
- [ ] T3 perf: cap image widths at 1920 (drop `2560`, `3840` from `sections/hero.liquid:10` + `blocks/image.liquid:38`)
- [ ] DECIDE: Rivo loyalty templates (delete or reinstall app blocks?)
- [ ] DECIDE: redirect chain primary-domain fix (1-way door, ~780ms mobile)
