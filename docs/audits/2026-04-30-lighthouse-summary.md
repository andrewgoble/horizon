# Lighthouse Audit — jambys.com — 2026-04-30

**Method:** Lighthouse CLI 13.1.0 via npx  
**Tool:** `--throttling-method simulate`  
**Mobile:** `--form-factor mobile` (4G throttle, 6x CPU slowdown)  
**Desktop:** `--preset desktop` (no throttle)

---

## Score Summary

| Category        | Mobile | Desktop | Target |
|-----------------|--------|---------|--------|
| Performance     | 31     | 61      | ≥80    |
| Accessibility   | 84     | 81      | ≥90    |
| Best Practices  | 50     | 50      | ≥90    |
| SEO             | 100    | 100     | 100    |

---

## Core Web Vitals

| Metric                      | Mobile     | Desktop   | Threshold (Good) |
|-----------------------------|------------|-----------|------------------|
| First Contentful Paint      | 5.4 s      | 3.4 s     | ≤1.8 s           |
| Largest Contentful Paint    | 6.0 s      | 3.5 s     | ≤2.5 s           |
| Total Blocking Time         | 2,270 ms   | 80 ms     | ≤200 ms          |
| Cumulative Layout Shift     | 0.004      | 0.002     | ≤0.1 ✓           |
| Speed Index                 | 19.2 s     | 6.6 s     | ≤3.4 s           |
| Time to Interactive         | 30.2 s     | 8.5 s     | ≤3.8 s           |

CLS is the only metric in the "Good" range. Everything else is "Needs Improvement" or "Poor."

---

## Top 3 Mobile Performance Opportunities

### 1. Render-Blocking Resources — 1,560 ms potential savings

Adobe Typekit CSS (`use.typekit.net`) is loaded synchronously in `<head>`, blocking all rendering until fonts are fetched. The Loop Returns block CSS and theme `view-transitions.js` are also render-blocking.

**Affected resources:**
- `https://use.typekit.net/hxg4nit.css` — 1,162 ms blocked
- Loop Returns `onstore-block.css` — render-blocking
- `https://p.typekit.net/p.css` — render-blocking
- Theme `view-transitions.js`
- Theme `compiled_assets/styles.css`

**Fix:** Add `rel="preload"` + `onload` swap for Typekit CSS, or use `font-display: swap` in the kit settings. Move non-critical JS to `defer`/`async`.

---

### 2. Font Display — 780–880 ms potential savings

Four Typekit font files load without `font-display: swap`, causing invisible text (FOIT) during font load. Combined savings: 780 ms mobile / 880 ms desktop.

**Affected fonts:**
- `af/66e20c` (likely the body or display font)
- `af/2a4cdd`
- `af/b718ff`
- `af/5d97ff`

**Fix:** In the Adobe Fonts kit settings, enable "Font Loading" → "Swap" (adds `font-display: swap` to the kit). This is a 2-click change in the Adobe Fonts dashboard — no code change required.

---

### 3. Third-Party JavaScript — 626 KB unused JS, 670+ ms TTFB

The page loads ~3.6 MB total. Third-party scripts account for the majority of unused JavaScript and are loaded eagerly on page load:

| Script                           | Total   | Wasted  |
|----------------------------------|---------|---------|
| Alia (`backend.alia-prod.com`)   | 226 KB  | 118 KB  |
| GTM (`gtag/js`)                  | 177 KB  | 61 KB   |
| GTM container                    | 166 KB  | 61 KB   |
| Facebook Pixel                   | 100 KB  | 91 KB   |
| Loop Returns                     | 112 KB  | 58 KB   |
| Intelligems                      | 93 KB   | ~all    |

Server response time is also 670–700 ms (threshold: <600 ms), adding to TTFB before any assets load.

**Fix:** Delay non-critical third-party scripts until after `load` event or user interaction (GTM supports this natively via tag firing triggers). Audit whether all 6 third-party platforms are still active and necessary.

---

## Accessibility Issues (score: 84/81)

| Severity | Issue | Detail |
|----------|-------|--------|
| High | `aria-hidden` contains focusable elements | Slideshow slides marked `aria-hidden="true"` but contain focusable children — keyboard users can tab into invisible content |
| High | Prohibited ARIA attributes | Elements using ARIA attributes in roles where they are not allowed |
| High | Color contrast failures | Footer utility links and text have insufficient contrast ratios |
| Medium | Heading order | Headings skip levels (e.g., h1 → h3) disrupting document outline |
| Medium | Links without discernible names | Link elements present with no text or accessible name |
| Low | Label/name mismatch | Visible button label doesn't match accessible name |
| Info | List structure issues | `<li>` elements used outside `<ul>`/`<ol>` |

**Highest-impact fix:** The `aria-hidden` slideshow issue is a WCAG 2.1 AA failure — fix it in the slideshow component by removing `aria-hidden` from active slide or ensuring focusable elements inside are also `tabindex="-1"`.

---

## Best Practices (score: 50/50)

| Issue | Detail |
|-------|--------|
| Browser console errors | Three 404 errors on page load; `MissingRefError` in `anchored-popover-component` (missing "trigger" ref) |
| Deprecated APIs | Attribution Reporting API deprecation warning (likely from Meta/Google tag) |
| Third-party cookies | Shop Pay session cookie (`_shop_app_essential`) flagged under new browser cookie policies |
| Inspector issues | Chrome DevTools Issues panel warnings present |

The 50 score is primarily driven by console errors and deprecated API usage — both fixable.

---

## Prioritized Fix List

### P0 — Highest ROI (performance, minimal theme risk)

1. **Enable `font-display: swap` on Typekit kit** — Adobe Fonts dashboard, 2-click change. Eliminates 780–880 ms of invisible text / render blocking. Zero theme code change.

2. **Defer non-critical third-party scripts** — Move Alia, Intelligems, Rise AI to load after `DOMContentLoaded` or on interaction. Can be done via GTM tag sequencing and/or adding `defer` to script tags. Estimated: 300–600 ms savings on TBT.

3. **Fix `anchored-popover-component` MissingRefError** — A JS component is crashing on init (missing "trigger" ref). This likely contributes to TBT and Best Practices score. Check which component is throwing this and ensure the ref is present or guarded.

### P1 — Meaningful gains (requires theme edits)

4. **Lazy-load non-hero images** — Marquee section images and below-fold product images should use `loading="lazy"`. Est savings: 242 KB on desktop.

5. **Fix image aspect ratios** — Images rendering with incorrect aspect ratios. Audit `img` tags without explicit `width`/`height` or with CSS overriding natural dimensions.

6. **Preload LCP hero image** — Add `<link rel="preload" as="image">` for the hero image in the `<head>`. This alone can cut LCP by 1–2 s.

### P2 — Accessibility (important for conversion + compliance)

7. **Fix slideshow `aria-hidden` + focusable children** — Remove keyboard-reachable elements from aria-hidden slides, or add `tabindex="-1"` to all focusable elements inside hidden slides.

8. **Fix footer link contrast** — Footer utility links fail contrast ratio. Darken text color or lighten background.

9. **Fix heading order** — Audit all page sections for h-level skips. Should be h1 → h2 → h3, no gaps.

### P3 — Server / infrastructure

10. **TTFB optimization** — Server response time is 670–700 ms (threshold: 600 ms). Check Shopify plan tier, CDN caching headers, and liquid render time. Enable "Storefront Renderer" caching if not already on.

11. **Investigate third-party cache misses** — Alia, Intelligems, Rise AI, Facebook Pixel have no-cache headers. 667 KB of these assets can't be browser-cached. Audit if any can be self-hosted or loaded with longer cache TTLs.

---

## Quick Wins Summary

| Win | Effort | Perf Impact |
|-----|--------|-------------|
| Typekit font-display:swap | 5 min (dashboard) | ~800 ms LCP |
| Defer Alia/Intelligems/Rise AI | 1–2 hrs | ~400 ms TBT |
| Preload hero image | 30 min | ~1–2 s LCP |
| Fix 404 console errors | 1 hr | Best Practices +20 |
| Fix aria-hidden slideshow | 1 hr | Accessibility +5 |

Addressing the top 3 performance quick wins could move mobile performance from **31 → 55+** and reduce LCP from 6.0 s to under 4 s.
