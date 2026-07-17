# Designer Customizer Changes — Audit

**Audit date:** 2026-06-05
**Window covered:** since last GitHub sync (2026-05-19) → today (~17 days)
**Live theme:** `horizon/main` (#129845231701) on jambys-chillwear.myshopify.com
**Diff baseline:** `origin/main` HEAD = `5be9807` (2026-05-19)
**Snapshot of live theme:** `/tmp/jambys-live-snapshot-2026-06-05/`
**Per-file diffs:** `docs/audits/2026-06-05-designer-changes/*.diff`

## TL;DR

The designer has been editing the LIVE Horizon theme directly in the Shopify customizer. The Shopify→GitHub auto-sync has not produced a `shopify[bot]` commit since 2026-05-19, so **all of his work is sitting in Shopify only** and would have been overwritten on the next ship from `main`. Snapshot is now preserved.

Real changes are confined to **4 theme files**. Locale `.json` files show diffs but they are pure Shopify auto-generated header noise — ignore them.

## Files changed

| File | Diff size | Nature of change |
|------|-----------|------------------|
| `config/settings_data.json` | 140 lines | Logo swap, brand color shift, button shape/case, color schemes |
| `sections/header-group.json` | 11 lines | Announcement bar promo updated |
| `templates/index.json` | 975 lines | Homepage hero rebuilt ("Meet Dune"), Categories grid swapped for products carousel |
| `templates/product.json` | 32 lines | PDP recs source + spacing, reviews sort order |
| `locales/*.{json,schema.json}` | many | **Noise** — Shopify added auto-gen header comments. Not designer work. |

## Detailed semantic changes

### 1. `config/settings_data.json` — global theme settings

**Logos (all 3 swapped):**
- `logo`: `Jambys_Logo_Blue.svg` → **`Wordmark.svg`**
- `logo_inverse`: `Jambys_Logo_White_2551a6b8…svg` → **`Inverse_Wordmark.svg`**
- `favicon`: `Lavender_Blue_J.jpg` → **`Jambys_Symbol.svg`**

**Brand color shift (Scheme 1, the primary):**
| Token | Was | Now |
|-------|-----|-----|
| `foreground_heading` | `#36409a` indigo | **`#4d66ff`** brighter blue |
| `foreground` | `#36409a` | **`#2f3e99`** deeper navy |
| `primary` | `#000f9f` royal | **`#2f3e99`** navy |
| `primary_hover` | `#2a2f7a` | **`#151a3d`** near-black navy |
| `shadow` | `#36409a` | **`#2f3e99`** |
| `primary_button_background` | `#36409a` | **`#4d66ff`** |
| `primary_button_hover_background` | `#2a2f7a` | **`#3a4dcc`** |
| `secondary_button_background` | `#36409a` | **`#4d66ff`** |
| `selected_variant_background_color` | `#36409a` | **`#4d66ff`** |
| `selected_variant_border_color` | `#2a2f7a` | **`#4d66ff`** |

**Scheme 4 (dark blue surface):** background `#000f9f` → **`#2f3e99`** (matches the new navy)

**Custom color schemes also adjusted:**
- `scheme-58084d4c` background: `#f3f4fa` → **`#ffffff`** (cleaner white)
- `scheme-a99acf1b` background: `#ecebff` → **`#eef0ff`**; foreground `#36409a` → **`#4d66ff`**
- `scheme-1eaaf9ef` background: `#f3f4fa` → **`#ffae34`** orange (! — new accent surface for some section)

**Buttons & UI density:**
- Primary button radius: `16px` → **`25px`** (pillier)
- Secondary button radius: `16px` → **`25px`**
- Primary button text case: `uppercase` → **`default`** (sentence case)
- Added: `type_line_height_paragraph: "body-normal"`
- Removed: `show_installments` key (was `false` already — drop is no-op)

### 2. `sections/header-group.json` — announcement bar

Promo copy:
- **Was:** `Spend $150 → Free Long Jambys. Spend $250 → Free Long Jambys AND Free House Hoodie`
- **Now:** `20% Off Sitewide PLUS free gifts over $150`

(Link target unchanged — still points at `/collections/mdwsale`.)

### 3. `templates/index.json` — homepage

**Hero rebuilt for a "Dune" product launch:**
- Heading: `<h1>Performance <em>Inactivewear</em></h1>` (1rem) → **`<h1><strong>Meet Dune.</strong></h1>`** (4.5rem)
- Sub-copy: `Ridiculously comfortable loungewear made from premium fabrics.` → **`Dune is here. The color of slow mornings and nowhere to be. Available now in all our core products.`**
- Hero image: `home-page-new-photo.jpg` → **`Image_Option_1_85b72cdb…jpg`**
- Hero CTA link: `shopify://collections/mdwsale` → **`shopify://products/dune-black-jambys`**
- Layout: `vertical_alignment: center` → `flex-end`; `gap: 0` → `10`; outer gap `12` → `20`

**Categories grid → product carousel:**
- A section that was `collections_grid` of `collection_card` blocks (Categories) has been replaced with a `products_carousel` of `product_card` blocks (product title, image, price, review stars).
- Inside the new card: title color `var(--color-primary)` → `var(--color-foreground)`; review stars added (alignment `left`).
- The old `<h3>Categories</h3>` heading was removed.

### 4. `templates/product.json` — PDP

- Product recommendation block: `recommendation_type: complementary` → **`related`** (different algorithm)
- Recommendation block spacing: `padding-block-start/end: 16` → **`50`** (much more breathing room)
- Okendo customer reviews block: added `sortOrder: mostRecent`

## What is NOT a designer change

- All `locales/*.json` and `*.schema.json` diffs are a single header comment Shopify auto-adds to mark a file as auto-generated. They contain no semantic translation changes. Safe to ignore in the merge-back.
- New images (`Wordmark.svg`, `Inverse_Wordmark.svg`, `Jambys_Symbol.svg`, `Image_Option_1_*.jpg`) live in Shopify CDN — no asset files in the theme tree changed.

## Risk flags

1. **Shopify→GitHub sync appears broken.** No `shopify[bot]` commit since 2026-05-19 despite ongoing live edits. If anyone had run our `ship` workflow (merge develop → main → push) before today, every change above would have been wiped. Need to investigate the GitHub integration before any further main pushes.
2. **All changes are unbacked except for this snapshot.** Treat `/tmp/jambys-live-snapshot-2026-06-05/` as canonical until the designer's work either lands in a new sandbox theme (next step) or is merged into the repo.
3. **Store theme count is ~80**, close to Shopify's 100-theme cap. Worth a cleanup pass eventually.

## Merge-back checklist (for later, after QA)

When the designer's work is approved, cherry-pick into the repo on a feature branch:

1. Copy these 4 files from the snapshot into a fresh branch off `main`:
   - `config/settings_data.json`
   - `sections/header-group.json`
   - `templates/index.json`
   - `templates/product.json`
2. Skip all locale diffs (header-comment noise).
3. Verify validate-theme + theme-check pass.
4. Backup `main` → ship via documented merge workflow.
