## Current State

Workspace setup complete. preview branch created and pushed to origin. CLAUDE.md written.
Preview theme not yet connected to Shopify (Andrew to do manually via Shopify admin).
Audit in progress: drift check + Lighthouse + mobile size selector investigation.

Note: Shopify auto-pushes Horizon upstream updates directly to main. This may be the
source of the mobile size selector regression — investigate git log for upstream changes.

## Next Session Kickoff

Mode: `shallow`
First action: Check if Andrew has connected preview branch to Shopify shadow theme
(update PREVIEW_THEME_ID in CLAUDE.md if so). Then review audit findings in docs/audits/
and begin first fix.

---

## Session 1 — 2026-04-30

**Work done:**
- Cloned andrewgoble/horizon → ~/Projects/jambys-theme/
- Created preview branch, pushed to origin
- Added CLAUDE.md, PROGRESS.md, .gitignore update, pre-push hook
- Discovered: Shopify auto-pushes upstream Horizon updates to main — likely source of size selector regression
- Drift check (see docs/audits/)
- Lighthouse audit on jambys.com (see docs/audits/)
- Mobile size selector regression documented (see docs/audits/)
