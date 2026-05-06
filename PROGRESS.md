## Current State
**Last session:** 2026-05-06 — S5: Brief session, no changes — confirmed next steps
**Next:**
- Verify S3 fixes on preview theme (scroll containment, swatch stroke, 3XL peek) — Jambys Chrome browser
- Ship develop → main if verified
- Typekit font-display:swap (Adobe Fonts dashboard — no code)
- Third-party JS audit — GTM duplicates, Alia, Loop Returns
**Branch:** develop / 1 commit ahead of origin (S4+S5 /done commits unpushed)

## Next Session Kickoff
**Mode:** shallow
**First action:** Open Jambys Chrome browser → preview theme → product with sizes on mobile → verify scroll stays in row, swatch stroke shows fully, 3XL peeks. If good, ship to main.
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
- [ ] Typekit font-display:swap (Adobe Fonts dashboard — no code)
- [ ] Third-party JS audit — GTM duplicates, Alia, Loop Returns

---

## Session 3 — 2026-05-01

### Accomplished
- Pushed S2 commit to origin/develop (was 1 commit ahead)
- Fixed mobile size selector layout: switched to horizontal scroll (Option A) — `flex-wrap: nowrap` + `overflow-x: auto` + `scrollbar-width: none`
- Fixed whole-page scroll: added `max-width: 100%` to contain scroll within the row
- Fixed swatch outline clipping: `overflow-x: auto` was applied to the color row too (both share `.variant-option--buttons`), implicitly clipping `overflow-y` and cropping the selection stroke on 3 sides. Fixed with `:not(.variant-option--swatches)` selector.
- Tightened mobile gap to `6px` so 3XL peeks into view hinting at scroll
- Added `overflow: visible` to `.variant-option__button-label--has-swatch` for full stroke display
- Updated CLAUDE.md: "shadow theme" → "preview theme" throughout, added Jambys Chrome browser profile rule
- Corrected session workflow: always use Jambys Chrome browser for preview theme verification

### Files Modified
| File | Changes |
|------|---------|
| `snippets/variant-main-picker.liquid` | Horizontal scroll, gap tighten, swatch overflow fix, :not() scoping |
| `CLAUDE.md` | "preview theme" terminology, Jambys Chrome browser note |

### Commits
- `ff3dd57` fix: horizontal scroll for size buttons on mobile
- `5cbc6d2` fix: contain size scroll to row, tighter gap, swatch outline unclipped
- `977b7ac` fix: exclude swatch row from overflow-x scroll (was clipping color stroke)

### Next Steps
- [ ] Verify all fixes on preview theme (Jambys Chrome browser, mobile emulation)
- [ ] Ship develop → main if verified
- [ ] Typekit font-display:swap (Adobe Fonts dashboard — no code)
- [ ] Third-party JS audit — GTM duplicates, Alia, Loop Returns

---

## Session 4 — 2026-05-05

### Accomplished
- Resumed project — found develop was 1 commit ahead of origin from S3
- Pushed develop to origin (`git push origin develop`) — GitHub integration deploying S3 fixes to preview theme

### Files Modified
_(none — push only)_

### Next Steps
- [ ] Verify S3 fixes on preview theme (Jambys Chrome browser, mobile view)
- [ ] Ship develop → main if verified
- [ ] Typekit font-display:swap (Adobe Fonts dashboard)
- [ ] Third-party JS audit — GTM duplicates, Alia, Loop Returns

---

## 2026-05-06 — Session 5: Brief session — no changes

### Accomplished
- Resumed project, confirmed next steps (preview theme verification + ship to main)
- No code changes this session

### Files Modified
_(none)_

### Next Steps
- [ ] Verify S3 fixes on preview theme (Jambys Chrome browser, mobile view)
- [ ] Ship develop → main if verified
- [ ] Typekit font-display:swap (Adobe Fonts dashboard)
- [ ] Third-party JS audit — GTM duplicates, Alia, Loop Returns
