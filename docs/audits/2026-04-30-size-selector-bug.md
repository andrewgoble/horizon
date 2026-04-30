# Mobile Size Selector Regression — 2026-04-30

## Symptom
Size selector buttons on mobile are visually much smaller than expected —
reduced font size, tighter padding, and no minimum dimensions.

## Root Cause

Commit `57de4dd` (Nov 26 2025, "Refines cart and product display on mobile",
author: Richard Forbes-Simpson / Graft Studio) added mobile overrides that
shrink the variant option buttons:

**File: `snippets/variant-main-picker.liquid`** (lines 530–547)

Added mobile media query on the button element:
```css
@media (max-width: 749px) {
  flex: 0 0 auto;
  min-width: auto;        /* removes minimum width */
  max-width: fit-content;
  padding-block: 6px;     /* reduced from theme default */
  padding-inline: 10px;
  min-height: auto;       /* removes minimum height */
}
```

Added mobile media query on the label text (lines 544–547):
```css
@media (max-width: 749px) {
  font-size: 11px !important;  /* forced 11px, overrides everything */
  line-height: 1.2 !important;
}
```

**File: `assets/base.css`** (line 4323)
```css
.product-grid__item .swatch {
  --max-swatch-size: 20px;   /* affects collection page swatches */
}
```

## Exact line numbers

| File | Line | Content |
|------|------|---------|
| `snippets/variant-main-picker.liquid` | 533 | `min-width: auto;` |
| `snippets/variant-main-picker.liquid` | 534 | `max-width: fit-content;` |
| `snippets/variant-main-picker.liquid` | 535 | `padding-block: 6px;` |
| `snippets/variant-main-picker.liquid` | 536 | `padding-inline: 10px;` |
| `snippets/variant-main-picker.liquid` | 537 | `min-height: auto;` |
| `snippets/variant-main-picker.liquid` | 546 | `font-size: 11px !important;` |
| `snippets/variant-main-picker.liquid` | 547 | `line-height: 1.2 !important;` (implied by block) |
| `snippets/variant-main-picker.liquid` | 582 | `min-height: auto;` (second occurrence, likely cart context) |
| `assets/base.css` | 4323 | `--max-swatch-size: 20px;` |

## Proposed Fix

Remove or increase the mobile overrides in `snippets/variant-main-picker.liquid`.

**Option 1 — Remove the mobile block entirely (safest)**
Revert to Horizon defaults. The base Horizon theme has been tested for mobile usability;
the original overrides were a Graft Studio customisation that went too far.

**Option 2 — Increase the values**
Keep the compact intent but use legible sizes:
- `font-size: 14px` (drop the `!important`)
- `padding-block: 10px`
- `padding-inline: 14px`
- Remove `min-width: auto` and `min-height: auto` overrides so buttons keep their
  accessible tap target size

For `assets/base.css` line 4323, the `--max-swatch-size: 20px` rule applies only to
`.product-grid__item .swatch` (collection page grid swatches, not the PDP). This may be
intentional — evaluate separately from the PDP fix.

## Files to Change
- `snippets/variant-main-picker.liquid` — lines 530–550 (the `@media (max-width: 749px)` blocks)
- `assets/base.css` — line 4321–4324 (the `.product-grid__item .swatch` block, evaluate separately)

## Next Step
Fix lives in Task: implement mobile size selector fix (separate task, branch: preview)
