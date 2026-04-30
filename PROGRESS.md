## Current State

Session 1 audit complete. preview branch set up with CLAUDE.md, .gitignore, pre-push hook.
Preview theme NOT yet connected to Shopify (Andrew to do manually).
Key findings: mobile Lighthouse 31/100, size selector regression identified (57de4dd).

## Next Session Kickoff

Mode: `shallow`
First action: Check if Andrew connected preview branch to Shopify shadow theme
(update PREVIEW_THEME_ID in CLAUDE.md). Then pick a fix to start:
  Option A: Size selector fix (snippets/variant-main-picker.liquid lines 533–546) — quick win
  Option B: Typekit font-display:swap — 5-min change in Adobe Fonts dashboard, no code
  Option C: Review and remove unused third-party scripts (GTM duplicates, etc.)

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
