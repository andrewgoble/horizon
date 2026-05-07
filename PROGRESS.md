## Current State
**Last session:** 2026-05-07 — S6: Extended mobile horizontal scroll to color swatches — 4-commit debug chain
**Next:**
- Verify latest swatch fix on preview: scroll works, ring shows fully, correct spacing (gap-sm)
- Ship develop → main if verified
- Typekit font-display:swap (Adobe Fonts dashboard — no code)
- Third-party JS audit — GTM duplicates, Alia, Loop Returns
**Branch:** develop / clean (up to date with origin)

## Next Session Kickoff
**Mode:** execute
**First action:** Open preview theme in Jambys Chrome browser → House Shorts PDP → mobile width → verify: swatches scroll horizontally, selection ring shows fully top+bottom, correct spacing between circles. If good, run ship workflow: backup/YYYY-MM-DD → merge develop → main → push.
**Open questions:** none
**Decisions pending:** none
**Ready plan:** none

---

## Session 1 — 2026-04-30

**Work done:**
- Cloned andrewgoble/horizon → ~/Projects/jambys-theme/
- Created preview branch, pushed to origin (bobbyteenager89 added as collaborator on andrewgoble/horizon)
- Added CLAUDE.md with live-site guardrails, branch model, MCP gates
- Added PROGRESS.md, .gitignore (.superpowers/ ignored), pre-push hook (blocks preview→main)
- Drift check: Apr 15-17 commits = Shoplift A/B framework + editor saves (not upstream Horizon). Already in preview.
- Size selector regression found: commit 57de4dd — see docs/audits/2026-04-30-size-selector-bug.md
- Lighthouse baseline: see docs/audits/2026-04-30-lighthouse-summary.md

**Lighthouse scores (jambys.com, 2026-04-30):**
| Category | Mobile | Desktop |
|----------|--------|---------|
| Performance | 31 | 61 |
| Accessibility | 84 | 81 |
| Best Practices | 50 | 50 |
| SEO | 100 | 100 |

**Top fixes by priority:**
1. Size selector mobile regression (snippets/variant-main-picker.liquid ~line 533)
2. Typekit render-blocking — enable font-display:swap in Adobe Fonts dashboard
3. Third-party JS bloat — GTM duplicates, Alia, Loop Returns loading eagerly
4. Console errors / MissingRefError in anchored-popover-component
5. No hero image preload (LCP: 6.0s mobile)

---

## Session 2 — 2026-04-30

### Accomplished
- Discovered `develop` branch already existed and was connected to Shopify preview theme (Graft Studio Nov 26 2025 work)
- Migrated all work from `preview` to `develop` via cherry-pick (8 commits)
- Rewrote CLAUDE.md: GitHub-only workflow (no Shopify CLI push/pull needed), correct branch names
- Deleted `preview` branch (local + origin)
- Fixed mobile size selector: removed Graft Studio's `font-size: 11px !important` + `min-width/height: auto` overrides from `snippets/variant-main-picker.liquid` (bug was live on jambys.com since Nov 26 2025)
- Merged `main` into `develop` — pulled in 80 commits of live content (announcement bar, etc.) so preview theme matches live site

### Files Modified
| File | Changes |
|------|---------|
| `CLAUDE.md` | Rewrote: GitHub-only workflow, removed CLI push/pull, removed theme ID placeholder |
| `snippets/variant-main-picker.liquid` | Removed Graft Studio mobile overrides shrinking size selector |
| `snippets/shoplift.liquid` | Conflict resolved (timestamp only) — took main's version |

### Next Steps
- [x] Verify size selector fix on preview theme (mobile) — carried into S3

---

## Session 3 — 2026-05-01

### Accomplished
- Pushed S2 commit to origin/develop (was 1 commit ahead)
- Fixed mobile size selector layout: switched to horizontal scroll — `flex-wrap: nowrap` + `overflow-x: auto` + `scrollbar-width: none`
- Fixed whole-page scroll: added `max-width: 100%` to contain scroll within the row
- Fixed swatch outline clipping: `overflow-x: auto` was applied to color row too (both share `.variant-option--buttons`), implicitly clipping `overflow-y` and cropping stroke on 3 sides. Fixed with `:not(.variant-option--swatches)` selector.
- Tightened mobile gap to `6px` so 3XL peeks into view hinting at scroll
- Added `overflow: visible` to `.variant-option__button-label--has-swatch` for full stroke display
- Updated CLAUDE.md: "shadow theme" → "preview theme", added Jambys Chrome browser profile rule

### Files Modified
| File | Changes |
|------|---------|
| `snippets/variant-main-picker.liquid` | Horizontal scroll, gap tighten, swatch overflow fix, :not() scoping |
| `CLAUDE.md` | "preview theme" terminology, Jambys Chrome browser note |

---

## Session 4 — 2026-05-05

### Accomplished
- Pushed develop to origin — S3 fixes deploying to preview theme

### Files Modified
_(none — push only)_

---

## 2026-05-06 — Session 5: Brief session — no changes

### Accomplished
- Confirmed next steps (preview theme verification + ship to main)
- No code changes this session

---

## 2026-05-07 — Session 6: Mobile swatch horizontal scroll

### Accomplished
- Extended mobile horizontal scroll to color swatches (was excluded via `:not(.variant-option--swatches)`)
- Debugged 3 cascading issues over 4 commits:
  1. **Outline clipping top/bottom** — `overflow-x: auto` forces `overflow-y: hidden`; fixed with `padding-block: 8px` (outline paints within padding box)
  2. **Circles shrinking** — swatch labels had `flex-shrink: 1` (default); size buttons have `flex: 0 0 ...` but swatches only override `flex-basis`. Fixed with `flex-shrink: 0` on `.variant-option__button-label--has-swatch` in mobile scroll context
  3. **Cramped swatches** — hardcoded `gap: 6px` from size rule was applied to swatches; restored `gap: var(--gap-sm)` (0.7rem / 11.2px)
- Used browser JS inspection (`getComputedStyle`) to confirm computed values during debugging
- Shopify webhook stalled mid-session (34min gap) — pushed 3× before sync resumed

### Files Modified
| File | Changes |
|------|---------|
| `snippets/variant-main-picker.liquid` | Mobile swatch scroll: padding-block, flex-shrink, gap (4 commits) |

### Commits
- `4f8b0e1` Mobile: extend horizontal scroll to color swatches (same as sizes)
- `9ae4691` fix: swatch scroll — padding-block to prevent outline clipping on overflow-x
- `9c1f155` fix: flex-shrink: 0 on swatch labels in mobile scroll
- `13369c4` fix: swatch scroll — restore gap-sm, increase padding-block to 8px for outline clearance

### Next Steps
- [ ] Verify latest swatch fix on preview (scroll + ring + spacing)
- [ ] Ship develop → main if verified
- [ ] Typekit font-display:swap (Adobe Fonts dashboard — no code)
- [ ] Third-party JS audit — GTM duplicates, Alia, Loop Returns
