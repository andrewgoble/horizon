# Structure Map: what the rebrand must keep working

Built from the code on 2026-10-27 (live `main` at `26683c5`). The rebrand changes **how things look**.
Everything on this page should still be there, in the same place, doing the same job afterwards.
If a change would remove or rename something here, stop and ask Andrew.

**Still to do (needs Shopify admin, so Andrew):** check this map against the live site. In particular,
which page templates are actually assigned to live pages (Replo, Rivo, Wonderment), and which apps are
still paid for and in use.

## Page templates and their sections (top to bottom)

| Template | Sections |
|---|---|
| `templates/index.json` (homepage) | section, section, marquee, product-list, collection-list, section, marquee, section |
| `templates/product.json` (every product page) | product-information, product-recommendations, _blocks, marquee, section |
| `templates/product.gq-house-hoodie.json` (GQ hoodie) | _blocks, product-information, product-recommendations, marquee, section, _blocks |
| `templates/product.gift-card.json` | product-information, product-recommendations, marquee |
| `templates/collection.json` | section, collection-menu, main-collection |
| `templates/collection.test-collection.json` | section, main-collection |
| `templates/list-collections.json` | main-collection-list |
| `templates/cart.json` | main-cart |
| `templates/search.json` | search-header, search-results |
| `templates/page.json` | main-page |
| `templates/page.contact.json` | main-page, section |
| `templates/blog.json` / `article.json` | main-blog / main-blog-post |
| `templates/404.json` | main-404, product-list |
| `templates/password.json` | password |
| `templates/gift_card.liquid` | the gift-card page customers receive |
| `templates/page.rivo-loyalty-landing-page.json` | Rivo loyalty page (Rivo app blocks plus custom sections) |
| `templates/page.rivo-referral-landing-page.json` | Rivo referral page |
| `templates/page.wonderment-tracking.json` | order-tracking page (Wonderment app block) |
| `templates/page.replo.*.liquid` (12 files) | Replo-built landing pages. **Some may be live ad or email destinations.** They don't use theme styling, so the rebrand won't restyle them automatically. |

Shared on every page:
- **Header** (`sections/header-group.json`): announcement bar plus header. Menus: `main-menu` and `horizon-menu`.
- **Footer** (`sections/footer-group.json`): footer. Menus: `footer-column-1` and `footer-column-2`.
- **Cart drawer** (`snippets/cart-drawer.liquid`): includes the **hand-built cart upsell** (`sections/cart-upsells.liquid`, `assets/cart-upsells.js`). This has been fixed twice, so restyle it but don't restructure it.

Menus, products, collections, metaobjects (for example the FAQs) and pages are edited in Shopify admin,
not in the theme.

## App embeds (switched on site-wide in theme settings)

These sit in `config/settings_data.json` → `current.blocks`. **All must stay enabled on the rebrand theme.**

| App | What it does | Customer-visible? |
|---|---|---|
| Klaviyo | Email/SMS signup forms and tracking | Yes (pop-ups and forms; styled inside Klaviyo) |
| Junip | Product reviews (also an app block on product templates) | Yes |
| Rivo | Loyalty and referrals | Yes (launcher widget) |
| Gorgias | Live chat | Yes (chat bubble) |
| Loop Returns | Returns and return-coverage | Yes (on-store) |
| Bogos | Free gift | Yes |
| Selleasy | Upsell widget (also on the GQ hoodie template) | Yes |
| Alia | Customer app frame | Yes |
| Intelligems | A/B testing | Indirectly. **Tests may target theme elements, so check active tests before launch.** |
| Elevar | Conversion tracking (data layer) | No, but **must fire** |
| Triple Whale | Attribution pixel | No, but **must fire** |
| Axon | Ads pixel | No, but **must fire** |
| Checkmate | Checked network | No |

App blocks placed inside templates: Junip reviews (product, GQ hoodie, gift card), Rivo landing-page blocks
(loyalty and referral pages), Selleasy (GQ hoodie), Wonderment (tracking page).

## Brand settings the rebrand will change

| Setting | Where | Today |
|---|---|---|
| Color schemes (10) | `config/settings_data.json` → `color_schemes` | Navy `#36409a` / `#2f3e99`, bright blue `#4d66ff`, lavender `#bdbaf6`, light `#eef0ff`, orange `#ffae34` |
| Body font | `snippets/theme-styles-variables.liquid` | `"sofia-pro"` (Adobe Fonts kit `hxg4nit`) |
| Heading and subheading fonts | same file | `"new-kansas"` / `"kansasnew"` |
| Logo, inverse logo, favicon | theme settings `logo`, `logo_inverse`, `favicon` | `Wordmark.svg`, `Inverse_Wordmark.svg`, `Jambys_Symbol.svg` |
| Button and card shape | theme settings `button_border_radius_*`, `card_corner_radius`, etc. | Pill buttons (25), radius 8 elsewhere |
| Brand stylesheet | `assets/jambys-brand.css` | Exists but flagged as unused in an earlier audit. Check before relying on it. |

## Don't touch without asking Andrew
- Anything in `layout/theme.liquid` that loads scripts (tracking, apps)
- `assets/cart-upsells.js` logic
- Removing any app embed or app block
- URLs/handles of pages, products or collections (they live in admin anyway)
