## Current State
**Last session:** 2026-06-05 — S12: Designer (Ricardo) customizer audit + theme cleanup 84→18 + Ricardo Sandbox theme created (Shopify-direct, no GitHub)
**Next:**
- Investigate Shopify→GitHub sync silence (no `shopify[bot]` commits since 2026-05-19 — explains why Ricardo's 17 days of live-theme edits never reached the repo)
- Ricardo QA loop: when he pings with finished work in `Ricardo Sandbox — 2026-06-05` (theme ID 137062219861), QA → merge into `develop` → ship via `main`
- T3 perf carryover: LCP hero preload (`blocks/image.liquid:36-50`) + `font-display: swap` in `base.css` + image width cap at 1920
- Font verification still pending: confirm `sofia-pro` on body + `new-kansas` on h1 via DevTools
- DECIDE: Rivo loyalty templates; redirect chain primary-domain fix (1-way door, ~780ms mobile)
**Branch:** develop / 1 unpushed commit (S11) + new audit docs untracked (committing now)

## Next Session Kickoff
**Mode:** shallow
**First action:** Pick from: (1) Shopify→GitHub sync investigation (highest priority — blocks safe future ship workflow), (2) Ricardo QA loop if he's sent finished work, (3) T3 perf carryover (image preload + font-display swap + width cap), (4) Adobe Fonts browser verification.
**Open questions:** none
**Decisions pending:** Rivo loyalty templates (delete or reinstall app blocks?); redirect chain primary-domain fix
**Ready plan:** `docs/audits/2026-05-23-full-audit-S10.md` — T3 perf carryover<br>`docs/audits/2026-06-05-ricardo-handoff.md` — Ricardo sandbox URLs + ground rules

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

---

## 2026-06-05 — Session 12: Ricardo Sandbox + Theme Cleanup (84→18) + Designer Customizer Audit

### Context — pivot
Original plan was T3 perf carryover. Andrew pivoted: a designer (Ricardo) had been editing the LIVE theme in the Shopify customizer for ~17 days, and we needed to (a) document what he changed, (b) move him off the live theme onto a safe Shopify-direct sandbox, (c) eventually merge approved work back to GitHub.

### Accomplished
- **Discovered Shopify→GitHub sync silence:** No `shopify[bot]` commits since 2026-05-19. All of Ricardo's 17 days of live-theme customizer work was sitting in Shopify only — a single ship from `main` would have wiped it. Flagged as the top risk to investigate next session.
- **Snapshotted live theme** (`horizon/main` #129845231701) to `/tmp/jambys-live-snapshot-2026-06-05/` — safety net before any further admin operations.
- **Designer customizer audit** ([docs/audits/2026-06-05-designer-changes.md](docs/audits/2026-06-05-designer-changes.md)): only 4 real files diverged from `origin/main` (locale diffs were Shopify auto-gen header noise — ignored). Real changes: logos swapped (Wordmark.svg / Inverse_Wordmark.svg / Jambys_Symbol.svg favicon), scheme-1 brand color shift to brighter blue `#4d66ff`, custom scheme orange background `#ffae34`, button radius 16→25 + sentence-case, announcement promo rewritten, "Meet Dune." homepage hero replacing "Performance Inactivewear", Categories grid swapped for products carousel, PDP recs `complementary→related` with padding 16→50. Per-file diffs in `docs/audits/2026-06-05-designer-changes/`.
- **Theme cleanup audit + execution** ([docs/audits/2026-06-05-theme-cleanup.md](docs/audits/2026-06-05-theme-cleanup.md)): store was at 84 themes vs Shopify's 20-theme CLI cap. Pulled 14 oldest + 5 newest non-GitHub themes locally as safety backups, then deleted 67 themes across 5 categories (S31 PDP/Gender Split WIP, Cristian feature branches, DTC backups, Search/Menu fix iterations, one-off feature themes). Preserved Category F (12 recent main copies) per user choice + 5 named keepers. Final state: 17 themes pre-sandbox, 18 post-sandbox.
- **Ricardo Sandbox created** — `Ricardo Sandbox — 2026-06-05` (theme ID 137062219861), uploaded as unpublished from the live snapshot via `shopify theme push --unpublished`. NOT GitHub-connected. Preview: https://jambys-chillwear.myshopify.com?preview_theme_id=137062219861 — Editor: https://jambys-chillwear.myshopify.com/admin/themes/137062219861/editor
- **Handoff doc** ([docs/audits/2026-06-05-ricardo-handoff.md](docs/audits/2026-06-05-ricardo-handoff.md)): theme URLs + ground rules (sandbox-only, no GitHub, don't publish, ping Andrew for QA).
- Live site (jambys.com) untouched throughout.

### Files Modified
| File | Changes |
|------|---------|
| `docs/audits/2026-06-05-designer-changes.md` | New — designer customizer change audit |
| `docs/audits/2026-06-05-designer-changes/*.diff` | New — per-file diffs (settings, header-group, index, product templates) |
| `docs/audits/2026-06-05-theme-cleanup.md` | New — 84→18 theme cleanup audit + categorized delete list |
| `docs/audits/2026-06-05-ricardo-handoff.md` | New — Ricardo's URLs + ground rules |
| `docs/audits/2026-04-30-lighthouse-*.{html,json}` | (Carried from prior session, now committed) |

### Gotchas / Learnings
- **Shopify CLI auth scope is per-invocation:** `theme list` (read) and `theme push` (write) prompt for separate device codes despite a "Logged in" state. Plan for 2 OAuth approvals per Shopify session.
- **Theme cap = 20 in CLI** (not 100 as Andrew remembered). The store was at 84 — heavy cull required before any `theme push --unpublished` works.
- **Shopify locale `.json` diffs are usually noise:** they auto-add a header comment `IMPORTANT: The contents of this file are auto-generated.` on first edit, even if no translation values changed. Skip these in any theme diff.
- **Shopify→GitHub sync can silently break.** No errors, no warnings — just no `shopify[bot]` commits. Need to audit the integration health independently of seeing commits in the log.

### Commits
- (committed at end of /done)

### Next Steps
- [ ] Investigate Shopify→GitHub integration health (Admin → Online Store → GitHub status; verify webhook + branch mapping)
- [ ] Ricardo QA loop — when he pings with finished work, diff sandbox vs main, merge via GitHub workflow
- [ ] T3 perf carryover: `blocks/image.liquid:36-50` LCP preload + eager + fetchpriority
- [ ] T3 perf: `font-display: swap` overrides in `base.css`
- [ ] T3 perf: cap image widths at 1920 (drop `2560`, `3840` from `sections/hero.liquid:10` + `blocks/image.liquid:38`)
- [ ] Adobe Fonts browser verification (carried from S11)
- [ ] DECIDE: Rivo loyalty templates (delete or reinstall app blocks?)
- [ ] DECIDE: redirect chain primary-domain fix (1-way door, ~780ms mobile)
