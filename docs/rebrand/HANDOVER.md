# Jambys Rebrand: Handover

**For:** Jack Ambrose and Ricardo Gómez, and the Claude session working with them.
**Owner / approver:** Andrew Goble
**Branch:** `rebrand-2026` in GitHub repo `andrewgoble/horizon`
**Started:** 2026-10-27 from the live site's code as of that day

---

## 1. How this setup keeps the live site safe

| Thing | What it is | Can the rebrand touch it? |
|---|---|---|
| `main` branch | The code for jambys.com. Any change goes live immediately. | **No.** It's locked on GitHub and blocked by the guard. |
| `rebrand-2026` branch | Your copy of the site code. | **Yes.** All work happens here. |
| "Rebrand 2026" theme in Shopify | An unpublished theme that copies `rebrand-2026` automatically, about a minute after each push. | Yes, by pushing. **Never click Publish.** |
| Products, prices, inventory, orders, checkout, customers | Shopify admin data, separate from the theme. | No. The theme only controls how things look. |

When the rebrand is approved, Andrew merges `rebrand-2026` into `main` at a planned time
(see `QA-AND-LAUNCH.md`). Until then customers see the current site.

## 2. Links

- **Preview link (send this around):** `PREVIEW_LINK_PENDING`. Andrew adds it once the Shopify theme is connected.
- **Theme editor for the rebrand theme:** `EDITOR_LINK_PENDING`
- **GitHub branch:** https://github.com/andrewgoble/horizon/tree/rebrand-2026

> Saving in the Shopify theme editor **for the rebrand theme** is fine. Shopify writes those saves back to
> this branch as "Update from Shopify" commits. Pull before you start, every time.
> Saving in the editor **for the live theme** changes jambys.com. Keep big design work off the live theme.

## 3. The daily loop (what Claude does)

1. **Sync.** Run `git pull origin rebrand-2026`, then `git fetch origin && git merge origin/main` to pick up live-site fixes.
2. **Ask.** The user describes the change in plain words, or shares a Figma frame or screenshot.
3. **Change.** Use the lightest tool that works, in this order:
   1. Theme settings in `config/settings_data.json`: color schemes, fonts, button radius, logo.
   2. `assets/jambys-rebrand.css`: brand-wide styling that settings can't express (create it on first use and load it from `snippets/stylesheets.liquid`).
   3. Section or block settings in `templates/*.json` and `sections/*-group.json`.
   4. Liquid in `sections/`, `blocks/` or `snippets/`, only when nothing above works. Follow the Horizon rules in `CLAUDE.md`.
4. **Check.** Run `shopify theme check --path .` if the CLI is installed. Keep everything listed in `STRUCTURE-MAP.md` working.
5. **Push.** Commit with a plain-English message, then run `git push`. Wait about a minute, then share the preview link plus the pages to look at.
6. **Log.** Add one line to the change log at the bottom of this file.

## 4. Brand inputs

What we know so far is in `BRAND-TOKENS.md`: Joy Blue / Fun Orange / Chill Teal, PP Formula Condensed for
headings, Sofia Pro for body text, and a new logo and symbol. **Ricardo's design files haven't been shared yet.**
Until they arrive, don't guess hex values or layouts. Ask the user for the Figma link or exports.

Where the brand currently lives in the code:
- **Colors:** 10 color schemes in `config/settings_data.json` → `color_schemes`. Most use `#36409a` and `#2f3e99` (navy) and `#4d66ff` (bright blue). One uses `#ffae34` (orange).
- **Fonts:** `snippets/theme-styles-variables.liquid`. Body uses `"sofia-pro"` from Adobe Fonts (kit `hxg4nit`, loaded by `snippets/fonts.liquid`). Headings use `"new-kansas"` and subheadings `"kansasnew"`. The rebrand swaps headings to PP Formula Condensed.
- **Logos:** theme settings `logo`, `logo_inverse` and `favicon` (`Wordmark.svg`, `Inverse_Wordmark.svg`, `Jambys_Symbol.svg` in Shopify Files). New files get uploaded to Shopify Files, then the settings point at them.
- **Shape:** buttons are pill-shaped (radius 25); cards, inputs and badges use radius 8.

## 5. While you're in there: known fixes

Pick these up when they touch the same area. None of them block the rebrand.
- [ ] **Unused sections and templates.** Old Wonderment sections (`sections/wonderment-*.liquid`), Shoplift (`assets/shoplift.css`) and possibly some Replo landing pages (`templates/page.replo.*.liquid`). **Check before deleting:** some Replo pages may still be linked from ads or emails. Ask Andrew for the list of live landing-page URLs first.
- [ ] **Mobile quick-add.** Set `mobile_quick_add` to true in theme settings.
- [ ] **Variant image on product cards.** Set `show_variant_image` to true.
- [ ] **Rivo loyalty pages.** `templates/page.rivo-*.json` use Rivo app blocks. Confirm with Andrew whether Rivo is still in use before restyling or removing them.
- [ ] **Font speed.** Load only the font weights the design actually uses. PP Formula Condensed should be self-hosted `.woff2` with `font-display: swap`.
- [ ] **Redirect chain on the primary domain.** This is a Shopify admin setting, so it goes to Andrew.

## 6. Asking Andrew for review

When a chunk is ready, message Andrew with:
- What changed, in a few bullets
- The preview link and the pages that show it best
- Anything from `OFF-THEME-CHECKLIST.md` that now needs his attention

## 7. Change log

| Date | Who | What |
|---|---|---|
| 2026-10-27 | Andrew (via Claude) | Branch created from live; guard, handover, structure map and checklists added |
