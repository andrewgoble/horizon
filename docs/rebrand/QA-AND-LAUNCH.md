# QA and launch plan

## Part 1: Test on the preview link before launch

Test on a phone **and** a desktop. Testers: Jack, Ricardo, Andrew. **Andrew signs off.**

### Every page type
- [ ] Homepage
- [ ] Product page: standard (`product.json`), GQ hoodie, gift card
- [ ] Collection page and the all-collections page
- [ ] Cart page **and** cart drawer, including the upsell carousel
- [ ] Search results and the predictive-search dropdown
- [ ] Contact, a regular page, blog and article
- [ ] 404 page and password page
- [ ] Rivo loyalty and referral pages, and the Wonderment tracking page (if still used)
- [ ] Header menus (desktop mega-menu and mobile menu) and footer menus

### Products and buying
- [ ] Every colorway shows the right swatch and photo, including names with a slash like "Clouds/Navy"
- [ ] Size selector on mobile (this has broken before)
- [ ] Add to cart, change quantity, remove item
- [ ] Discount code at checkout
- [ ] Free-gift (Bogos) and upsells (Selleasy, cart drawer) appear
- [ ] Reach checkout and confirm it shows the new branding (see off-theme checklist row 1). Don't place a real order.

### Apps and tracking
- [ ] Reviews (Junip), loyalty launcher (Rivo), chat (Gorgias), Klaviyo signup form, Loop all show and work
- [ ] Tracking still fires: Elevar data layer, Triple Whale, Meta/Google/TikTok pixels (Andrew checks with the browser tools or pixel helpers)
- [ ] Intelligems: no active test targets an element the rebrand removed or renamed

### Quality
- [ ] Text is readable: contrast passes on every color scheme (WCAG AA)
- [ ] Page speed: the Lighthouse mobile score isn't worse than the current site (baseline: `docs/audits/2026-05-23-lighthouse-S10.md`)
- [ ] Fonts load without a long flash of invisible text

### Definition of done
All boxes above are ticked or explicitly accepted by Andrew. Rows 1–8 and 10–12 of the off-theme checklist are done or deferred on purpose.

## Part 2: Launch

1. **Pick the window.** Low traffic (weekday morning), not during a sale or email send, and not while an Intelligems test is running on affected pages.
2. **Back up.** In Shopify, duplicate the live theme (`BACKUP pre-launch YYYY-MM-DD`). In GitHub, create `backup/YYYY-MM-DD` from `main`.
3. **Sync.** Merge `main` into `rebrand-2026` one last time so no live edit is lost. Re-check the preview.
4. **Decide on the guard.** The `.claude/` guard and the rebrand section of `CLAUDE.md` come along with the merge. Keep the guard (it blocks direct pushes to `main`) or remove it first. Andrew's call.
5. **Go live.** Andrew merges a pull request from `rebrand-2026` into `main` on GitHub. Shopify updates jambys.com within minutes. (An alternative is to publish the "Rebrand 2026" theme directly in Shopify. Either way, Andrew does it.)
6. **Do the off-theme switches at the same time:** checkout branding, notification emails, app styling.

## Part 3: Watch and roll back

- **Who watches for the first 4 hours:** Andrew (orders and checkout) and Jack (analytics and conversion).
- **Watch:** orders coming in, conversion rate against the same weekday last week, add-to-cart rate, error reports from customers or Gorgias chats.
- **Roll back if** checkout or add-to-cart breaks, or conversion drops sharply versus the same weekday. Andrew sets the exact threshold before launch.
- **How to roll back (one click):** Shopify → Online Store → Themes → the `BACKUP pre-launch` theme → Publish. Then fix on `rebrand-2026` and relaunch.
- **After 48 hours:** confirm tracking data looks normal in Triple Whale and Elevar, then delete nothing for at least 30 days.
