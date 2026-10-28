# Jambys Theme Review: 10 ranked improvements

**Date:** 2026-10-28
**Branch:** `andrew/perf-cro-review` (cut from live `origin/main` @ `26683c5`; separate from `rebrand-2026`)
**Scope:** Audit and plan only. No theme code, Shopify admin or Intelligems changes were made.
**Update (same day):** Andrew is handling all Intelligems work (offers, free shipping, post-purchase,
checkout blocks, A/B tests) separately in Atlas. This theme plan no longer depends on Intelligems.
Item 2 and the Intelligems parts of items 1, 4 and 5 are marked "→ Atlas".
**Published page:** https://claude.ai/artifact/FGBVDFCaJeeofSmQBWXUet (same content, plain language; private to Andrew)

---

## The short version

- **Real shoppers already get a fast site.** Google's real-user data (CrUX, 75th percentile) says
  pages paint in 1.6–1.9 s, respond to taps in about 138 ms, and don't jump around. All three are
  in Google's "good" band. Lab scores improved a lot since May (home mobile 39 → 60). Speed is a
  real but secondary lever now.
- **The bigger leak is shoppers not adding to cart.** Of 96,077 sessions (Aug 3 – Oct 26), 4.3%
  added to cart, down 20% on the prior period. 76.8% bounced.
- **Order size is where the money is.** A 1-unit order earns about $31 gross profit; a 2-unit order
  earns about $64. Free shipping effectively starts at $150, which most 2-item carts miss.
- **Checkout upsells are not possible on the Advanced plan.** Shopify and Intelligems both say
  in-checkout blocks need Plus. Post-purchase upsells do work on Advanced, but only one app can own
  that slot, and Aftersell holds it today.

---

## Ranked plan

Impact is relative to the other items here. Effort: **XS** = under an hour (usually an admin
setting), **S** = about half a day, **M** = 1–3 days. "Rebrand overlap" means the item would touch
files or settings the `rebrand-2026` branch also changes.

| # | Improvement | Impact | Effort | Risk | Rebrand overlap |
|---|---|---|---|---|---|
| 1 | Data-led cart drawer upsell rules, built in the theme | High | M | Low–Med | **Yes**: cart upsell files |
| 2 | Clean up the free-shipping and discount setup (→ Atlas) | High | S | Med | No |
| 3 | Fix four blank customer pages | Medium | XS | Low | No |
| 4 | Test mobile quick-add to lift add-to-cart | Med–High | S | Low | **Yes**: `config/settings_data.json` |
| 5 | Remove dead checkout leftovers from the Plus days | Low–Med | XS | Low | No |
| 6 | App diet: cut script weight from overlapping apps | Medium | M | Med | **Yes**: app embeds |
| 7 | Speed fixes in theme code (hero image, image sizes) | Med–Low | S | Low | Low (not styling) |
| 8 | Make the editor-vs-git workflow safe | Process | S | Low | **Yes**: shared process |
| 9 | Retire the Replo landing pages and leftover code | Low | S | Low | No |
| 10 | Make the code check meaningful (428 errors → the 1 real one) | Low | XS | Low | No |

### 1. Data-led upsells (cart drawer rules + post-purchase)
- **What:** Replace the cart drawer's generic "You may also like" picks with rules built from what
  Jambys customers actually buy together. Add a one-click post-purchase offer through Intelligems.
  Full logic is in the Upsell section below.
- **Why (evidence):**
  - 1-unit orders are 35.5% of orders and earn ~$31 gross profit each, against ~$64 for a 2-unit
    order. Source: Intelligems unit mix, Aug 3 – Oct 26.
  - StayCool JamTee buyers also bought StayCool Jambys 56% of the time, 4.4× more often than
    chance. Clouds/Navy JamTee and Clouds/Navy Jambys go together 9.9× more often than chance.
  - The drawer today shows Shopify's pinned picks, e.g. Black House Hoodie and Black JamTee for
    Black Jambys. It never offers a second pair, which is the most common multi-item order.
- **Measure:** Compare 4 weeks before and after in Shopify order data: units per order, the share
  of orders with 2+ categories, and conversion rate. Put the rules behind a theme on/off setting so
  Atlas can A/B test them later. The post-purchase offer → Atlas.
- **Effort:** M. **Risk:** Low–Med. The drawer upsell has been fixed twice, so change the logic
  carefully and fold in the open stale-fetch race fix (`todos/001`).
- **Rebrand overlap:** **Yes.** The rebrand will restyle `sections/cart-upsells.liquid` and
  `assets/cart-upsells.js` ("restyle, don't restructure"). Keep logic changes in JS and styling in
  CSS, and agree the order with the rebrand.

### 2. Clean up the free-shipping and discount setup (→ Atlas)
- **What:** One Intelligems personalization, "MDW Weekend", sets shipping and discounts site-wide.
  It was named for Memorial Day, was restarted on Aug 28 and has run for 61 days. It gives free
  shipping at $150 and $30 off at $250, and the cart drawer bar shows it ("Spend $82.00 to get free
  shipping" on a $68 cart). The offer inside it is marked disabled, so it's unclear which rules
  actually apply. Seven more "Volume Offer Test Group" offers are still enabled.
- **Why (evidence):**
  - Order subtotals cluster at the price of 1, 2 and 3 items: $50–69, $100–109, $130–139 and
    $160–169.
  - Orders of $150+ ship free about 100% of the time. Most orders between $110 and $149 still pay
    $5–7 shipping.
  - 2-item carts mostly fall short of the free-shipping line; 3 items cross it.
  - Earlier Intelligems shipping tests ran only 1–8 days each, too short to read at about 140
    orders a week.
- **Measure:** First rename or replace the campaign so its rules are explicit. Then run a shipping
  test. The arms are hypotheses: free shipping at 2 items vs. the current 3-item line. The primary
  metric is gross profit per visitor, and the test runs to Intelligems' estimated length.
- **Effort:** S (Intelligems config). **Risk:** Medium, because it changes what customers pay.
- **Rebrand overlap:** No.

### 3. Fix four blank customer pages
- **What:** Several pages only show a heading because the app that used to fill them is gone:
  - `/pages/order-tracking`: 535 sessions started here in 90 days, more than any other content
    page.
  - `/pages/rewards`: 127 sessions.
  - `/pages/outfit-builder`: 122 sessions.
  - `/pages/bundle-builder`: 97 sessions.

  A working tracking page already exists at `/pages/tracking` (the Wonderment form).
- **Why:** The page bodies are empty in Shopify (last edited 2021–2024), and both the browser and
  the raw HTML showed only the title. Shoppers who can't track an order contact support instead.
- **Measure:** Sessions on those URLs move to working pages, and order-status tickets in Gorgias go
  down.
- **Effort:** XS (Shopify admin URL redirects, which need your approval). **Risk:** Low.
- **Rebrand overlap:** No.

### 4. Test mobile quick-add to lift add-to-cart
- **What:** Turn on `mobile_quick_add` (currently `false`) as an Intelligems A/B test, so mobile
  shoppers can add from collection pages.
- **Why:** The add-to-cart rate is 4.3% of sessions, down 20%. Mobile brings 68% of visitors and 77%
  of orders. This was a pending quick win from the July audit (S33).
- **Measure:** Add-to-cart rate and conversion rate on mobile; revenue per visitor is the decider.
- **Effort:** S. **Risk:** Low.
- **Rebrand overlap:** **Yes.** It's a line in `config/settings_data.json`, which the rebrand also
  edits for colors. Small, but sequence it to avoid a merge conflict.

### 5. Remove dead checkout leftovers from the Plus days
- **What:** The Aftersell "Upsell Widget" checkout block is still in the checkout profile but can't
  run on Advanced (its own dashboard shows $0 checkout revenue). Intelligems "Rollout of Checkout
  Block 3 USPs" has been live since Oct 2025 with a trust badge in an in-checkout slot, which
  Advanced also can't show.
- **Why:** Both are invisible but still configured. Aftersell bills about $99/month plus usage
  (July figure).
- **Measure:** A test checkout confirms nothing is lost, and the monthly app bill drops.
- **Effort:** XS (admin). **Risk:** Low.
- **Rebrand overlap:** No.

### 6. App diet: cut script weight from overlapping apps
- **What:** Review the 14 app embeds and remove or limit the ones that overlap or load everywhere
  for little use.
- **Why (evidence, home page on mobile in the lab):**
  - **Alia** costs about 494 KB and 22 requests on every page, plus 0.3 s (home) to 1.4 s (cart) of
    processor time. It is the heaviest single app.
  - **Three offer and upsell tools run at once** (Bogos ~91 KB, Selleasy ~36 KB, Intelligems
    offers) alongside the hand-built drawer upsell. Selleasy loads on every page but only has a
    block on the GQ hoodie template.
  - **Loop's on-store CSS** blocks the first paint by ~750 ms in the lab.
  - **Rivo** loads 111 KB on every page.
  - The cart page spends **5.8 s** running scripts in the lab, against 1.0 s on home.
- **Measure:** Lighthouse scripting time on the cart page and total page weight. Check conversion
  before and after.
- **Effort:** M (app-by-app, admin). **Risk:** Medium, because some apps carry revenue or support
  work.
- **Rebrand overlap:** **Yes.** The rebrand's structure map says every embed must stay on. Agree
  removals first.

### 7. Speed fixes in theme code
- **What:**
  - Mark the first big image on home, product and collection pages as top priority
    (`fetchpriority="high"`). Lighthouse flags it as missing on all three.
  - Stop serving the product photo from a 3840 px source in a slot that is a quarter of the screen.
  - Trim render-blocking CSS, which costs 350–530 ms in the lab.
- **Why:** Lab mobile LCP (time until the biggest element appears) is 6.3–6.8 s, down from
  8.8–11.3 s in May. Real users already see 1.6–1.9 s, so this mainly helps slower phones and the
  score.
- **Measure:** Re-run the same 8 Lighthouse tests.
- **Effort:** S. **Risk:** Low.
- **Rebrand overlap:** Low. It touches `blocks/image.liquid` and the product media code, not
  colors or fonts. Font loading is left out on purpose because the rebrand is changing fonts.

### 8. Make the editor-vs-git workflow safe
- **What:**
  - Retire or reset `develop`.
  - Do work on named branches previewed on a preview theme, as this branch and `rebrand-2026`
    already do.
  - Add a "pull first" check, because editor saves land on `main` as bot commits.
- **Why:**
  - All 34 commits on `main` since Jul 20 are Shopify-editor saves by `shopify[bot]`, many by
    Ricardo.
  - `develop` is 33 commits behind `main`, and its last human commit was Jul 23.
  - `CLAUDE.md` still describes a develop→main ship flow that no longer matches reality.
- **Measure:** No surprise overwrites, and every live change traces to a branch or an editor save.
- **Effort:** S. **Risk:** Low.
- **Rebrand overlap:** **Yes.** It affects how both branches ship, so agree one flow.

### 9. Retire the Replo landing pages and leftover code
- **What:** All 12 Replo templates are still assigned to live pages, but traffic is tiny. The
  busiest had 57 landing sessions in 90 days, and the rest had 30 or fewer. Redirect them to
  current collection pages, then delete the templates and the ~3 MB of Replo snippet chunks.
- **Why:** These pages cause 93 of the 428 code-check errors and are the bulk of the snippet
  folder.
- **Measure:** Redirects resolve and the error count drops.
- **Effort:** S. **Risk:** Low. Check the redirect list against any running ads first.
- **Rebrand overlap:** No. The rebrand already excludes Replo pages.

### 10. Make the code check meaningful
- **What:** The 428 `shopify theme check` errors break down as:
  - 307 missing translations across 51 language files.
  - 93 from Replo pages.
  - 16 false alarms in stock Horizon sections.
  - 11 app-block false alarms. The Rivo loyalty page was checked in the browser and renders
    fully.
  - **1 real error:** the "loading" label is missing, so screen readers in the cart drawer hear
    "Translation missing: en.accessibility.loading".

  Add a check config that ignores the known noise and fix the one real key.
- **Measure:** The check reports 0 errors, so the next real one stands out.
- **Effort:** XS. **Risk:** Low.
- **Rebrand overlap:** No.

---

## Upsell logic proposal

### What the data says
Sources: Intelligems analytics, Aug 3 – Oct 26 (1,688 orders, 83,277 visitors), and Shopify order
lines through the Intelligems connector, last 90 days, Online Store (1,441 paid orders after
removing $0 gift lines).

| Fact | Number |
|---|---|
| Average order value / median | $131 / $109 |
| Units per order | 2.2 |
| Orders with 2+ different products | 39.4% |
| Orders spanning 2+ categories (e.g. shorts + tee) | 22.9% |
| Orders that are Jambys shorts only | 51.8% |
| 1-unit share of orders / gross profit per 1-unit order | 35.5% / ~$31 |
| Gross profit per 2-unit order | ~$64 |
| Cheapest in-stock item (excl. gift card) | $58 (JamTank) |
| Effective free-shipping line | $150 (Intelligems campaign) |

**Bought together** (how often B is in the order when A is; "lift" = how many times more than
chance):

| If the cart has… | …they also bought | Attach | Lift |
|---|---|---|---|
| JamTee | Jambys shorts | 54% | 0.8 |
| Jambys shorts | JamTee | 12% | 0.8 |
| StayCool JamTee | StayCool Jambys | 56% | 4.4 |
| StayCool Jambys | StayCool JamTee | 21% | 4.4 |
| House Hoodie | Jambys shorts | 37% | 0.6 |
| Jambys shorts | Long Jambys | 5% | 0.3 |
| Clouds/Navy JamTee | Clouds/Navy Jambys | n/a | 9.9 |
| Navy JamTee | Navy/Black Jambys | n/a | 2.0 |

The most common pair is two colors of Jambys shorts (Black + Navy/Black: 34 orders).

**Caveat:** Intelligems counts 35.5% of orders as 1-unit, while Shopify line data shows 13.9%. The
two systems count units differently, probably because of packs and bundles. Reconcile this before
setting any target.

### Cart drawer rules (in order; first rule that fits wins, show at most 2 items)
1. **Complete the set.** The cart has shorts but no top: offer the top in the **same fabric and
   colorway**, e.g. StayCool Jambys → StayCool JamTee. Evidence: lift 4.4 and 9.9.
2. **Top only.** The cart has a JamTee but no shorts: offer the matching Jambys shorts. 54% of
   JamTee orders already include them.
3. **One more pair.** The cart has only shorts: offer a **second colorway in the cart's size**. Evidence: 51.8% of orders are shorts-only,
   and the top pairs are two colorways.
4. **Hoodie.** The cart has a House Hoodie: offer matching Jambys shorts (37% attach).
5. **Fallback:** today's Shopify complementary picks.

**Eligibility:**
- Never offer something already in the cart, out of stock in the cart's size, a gift card, a $0
  free gift (Bogos), or anything in a B2B or wholesale order.
- Hide the block when nothing qualifies.
- No extra discount in the cart in the first test, to protect margin. A discount is a separate
  test.

**Thresholds:** None in the theme. The free-shipping line lives in Intelligems ($150 today), which
is Atlas's job now. Rule 3 doesn't depend on it, so the two can't drift apart.

**Measure (theme-side, no Intelligems):** 4 weeks before vs after in Shopify order data. An on/off
setting lets Atlas run a proper A/B test later. The bullets below describe that later Atlas test.
- Primary metric: net revenue per visitor.
- Secondary: share of orders with an upsell item, and units per order.
- Guardrail: conversion rate.
- At about 140 orders a week, expect it to take several weeks. Run it to Intelligems' estimated
  length.

### Checkout upsells: not available on Advanced (notes for Atlas)
- **Checked:**
  - Shopify's docs say extensions on the information, shipping and payment steps are **Shopify
    Plus only**.
  - Intelligems' checkout FAQ says checkout blocks "are only available to Shopify Plus merchants".
  - The store plan is Advanced (`get_shop_info`).
- **Thank-you and order-status pages:** Shopify allows apps there on Advanced, but Intelligems'
  FAQ doesn't say its blocks work there. Ask Intelligems support before planning anything.
- **Recommendation:** Don't build an in-checkout upsell. Remove the dead ones (item 5).

### Post-purchase upsell: available, with two conditions (→ Atlas)
- **What Intelligems says:** Post-purchase works on every Shopify plan. It needs the Intelligems
  "Unlimited" or "Smart Checkout & Post-Purchase" plan. **Check which plan Jambys is on.**
- **One app per slot:** Shopify lets only one app own the post-purchase slot. **Aftersell owns it
  today** (about $302 post-purchase revenue in 30 days, July figure). Moving the slot to
  Intelligems is an admin change that needs your approval.
- **Who doesn't see it:** Shoppers paying with PayPal, Apple Pay, Google Pay, Amazon Pay or
  buy-now-pay-later skip the page.
- **Offer logic:**
  - One item: take the highest-priced item in the order as the anchor, then apply rule 1 or 2 from
    the cart list to whatever is missing from the order.
  - Use the same size as the order.
  - Exclude anything already in the order.
- **Build note:** Use a code rule, not the no-code product conditions. Those read the cart, and
  the cart is empty after purchase (seen in an earlier Atlas build).
- **Test:**
  1. Record Aftersell's current post-purchase revenue per order as the baseline.
  2. Switch the slot, then split 50/50 between the offer and no offer.
  3. Primary metric: gross profit per eligible order. Guardrails: refunds and payment failures.
  4. Run at least 2 weeks.
- **Discount:** A discount on the offer is a later test, compared against full price.

---

## Speed: then vs now

Lighthouse via PageSpeed Insights, simulated mobile and desktop. May figures come from
`2026-05-23-lighthouse-S10.md`, with the same apex URLs.

| Page | Mobile score May → Oct | Desktop May → Oct | Mobile LCP May → Oct | Mobile blocking time May → Oct |
|---|---|---|---|---|
| Home | 39 → **60** | 62 → **88** | 10.2 s → 6.3 s | 790 → 92 ms |
| Product (Navy/Mint) | 35 → **52** | 54 → **71** | 9.8 s → 6.8 s | 980 → 376 ms |
| Product (Glacier JamTee) | 30 → **48** | n/a | 11.3 s → 6.6 s | 1,570 → 506 ms |
| Collection (Jambys) | new: 49 | new: 68 | 6.6 s | 431 ms |
| Cart | 42 → **33** (worse) | n/a | 9.7 s → 7.8 s | 700 → **1,941 ms** |

**Real users (CrUX, 75th percentile):** LCP 1.6–1.9 s, INP 136–138 ms, CLS 0, all "good".

**Still costing time:**
- **Redirect:** `jambys.com` → `www.jambys.com` costs 780 ms in the mobile lab. Ads and most links
  already use `www`. Changing the primary domain is a one-way door, so it stays parked.
- **Render-blocking files:** Intelligems `bundle.js` (keep it, since it runs the tests), Loop CSS,
  and theme CSS.
- **Page weight:** Home HTML is about 700 KB to download, and the page runs 151 scripts and loads
  146 images.

---

## What we reviewed (appendix)

- **Pages:**
  - Home, collection (`/collections/jambys`), product (`/products/black-black`, top seller), gift
    card, search, 404, cart page and cart drawer.
  - Rivo loyalty and referral pages: they render fully in the browser.
  - Wonderment tracking: it works.
  - Replo pages: two fetched, all 12 mapped to live pages.
  - All 125 store pages fetched to find the blank ones.
  - The GQ hoodie template was reviewed in code only. Its product didn't show in public search.
- **Speed:** 8 PageSpeed runs (home, product, collection × mobile and desktop; Glacier and cart on
  mobile), compared with the May S10 baseline. App weight was grouped by vendor host.
- **Code:**
  - `shopify theme check` on live `main` (428 errors, 69 warnings).
  - App embeds in `config/settings_data.json` (14, all on).
  - Template map from `rebrand-2026:docs/rebrand/STRUCTURE-MAP.md`, plus git history for
    `main`, `develop` and `rebrand-2026`.
- **Data:** Intelligems connector, read-only:
  - Shop info: Advanced plan, not Plus.
  - Sitewide snapshot and funnel, device split, order-value distribution and unit mix.
  - Top products, experiments, experiences, offers and checkout blocks.
  - Session landing pages, plus 3,951 order-line rows used for the co-purchase pairs.
- **Docs used:** `CLAUDE.md`, `PROGRESS.md`, the May and June audits, `todos/001`, and Shopify and
  Intelligems docs on plan limits.
- **From Atlas (read-only):**
  - The basket and co-purchase method: drop $0 gift lines and group by product.
  - The post-purchase test spec shape: 50/50 split, profit per eligible order, at least 2 weeks.
  - The no-code-rule gotcha: conditions read the cart, which is empty after purchase.
  - The cart-upsell test metrics.
  - Atlas has no Jambys CRO work and no `upsell-attach-rate` skill.
- **Not verified:**
  - The product page's "Pair it With" row didn't load during review, but the browser pane was
    hidden, which stops lazy-loading. Re-check in a visible browser.
  - `content.9gtb.com` (63 KB on every page) is unidentified.
- **Not done:** No admin, theme or Intelligems writes, and no pushes to `main`.
