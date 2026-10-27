# Brand tokens (fill in from Ricardo's design)

**Status:** names known, values **not yet shared**. Claude must not invent hex codes. Ask for the design file.

## Colors

| Name | Hex | Used for (from the design) |
|---|---|---|
| Joy Blue | `TBD` | |
| Fun Orange | `TBD` | |
| Chill Teal | `TBD` | |
| Text / ink | `TBD` | |
| Background / off-white | `TBD` | |
| Others from the design | | |

How they get applied: map each of the 10 existing color schemes in `config/settings_data.json` to the new
palette (background, text, button, button text, border). Then check every scheme for contrast (WCAG AA).

| Current scheme | Today (bg / text / button) | New (bg / text / button) |
|---|---|---|
| scheme-1 | #ffffff / #2f3e99 / #4d66ff | |
| scheme-2 | #ffffff / #36409a / #36409a | |
| scheme-3 | #ffffff / #36409a / #36409a | |
| scheme-4 | #2f3e99 / #ffffff / #ffffff | |
| scheme-5 | #36409acf / #ffffff / #ffffff | |
| scheme-6 | transparent / #ffffff / #ffffff | |
| scheme-58084d4c… | #ffffff / #36409a / #36409a | |
| scheme-a99acf1b… | #eef0ff / #4d66ff / #36409a | |
| scheme-a22c3a6c… | #bdbaf6 / #36409a / #36409a | |
| scheme-1eaaf9ef… | #ffae34 / #fafafa / #36409a | |

## Type

| Role | Font | Source | Weights needed |
|---|---|---|---|
| Headings (h1–h4) | PP Formula Condensed | Self-hosted `.woff2` in `assets/`, **web license required** | `TBD` |
| Subheadings | `TBD` (PP Formula Condensed or Sofia Pro?) | | |
| Body, buttons | Sofia Pro | Adobe Fonts kit `hxg4nit` (already wired up) | `TBD` |

Change it in `snippets/theme-styles-variables.liquid` (the `--font-heading--family` and
`--font-subheading--family` lines, currently `"new-kansas"` / `"kansasnew"`). Add the `@font-face` rules
for PP Formula Condensed with `font-display: swap`.

## Logo and symbol

| Asset | File (SVG) | Uploaded to Shopify Files? |
|---|---|---|
| Wordmark | `TBD` | [ ] |
| Inverse wordmark (on dark backgrounds) | `TBD` | [ ] |
| Symbol / favicon | `TBD` | [ ] |
| Social share image (1200×630) | `TBD` | [ ] |

## Other style decisions from the design
- Button shape (today: pill, radius 25): `TBD`
- Card and image corners (today: 8): `TBD`
- Uppercase or sentence-case headings: `TBD`
- Photography / illustration direction: `TBD`
