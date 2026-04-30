# Jambys Theme — Setup & First Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clone `andrewgoble/horizon` into the `jambys-theme` workspace, establish the `preview` branch + safety guardrails, write CLAUDE.md, run a drift audit against the live theme, run Lighthouse on jambys.com, and identify the mobile size selector regression.

**Architecture:** Direct clone of `andrewgoble/horizon` into `~/Projects/jambys-theme/`. All dev work happens on the `preview` branch. `main` is live and protected by a local git hook. Shopify GitHub integration auto-deploys `main` → jambys.com.

**Tech Stack:** Shopify Horizon v2.1.5 · Liquid · Shopify CLI · `mcp__shopify-dev-mcp__*` tools · git

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `~/Projects/jambys-theme/` | Replace placeholder with real clone | `andrewgoble/horizon` codebase |
| `CLAUDE.md` | Create | Project rules, banned commands, session ritual, MCP gates |
| `PROGRESS.md` | Create | Session log |
| `.gitignore` | Modify | Add `.superpowers/` |
| `.git/hooks/pre-push` | Create (local only, not committed) | Block direct pushes to main from non-main branch |
| `docs/audits/YYYY-MM-DD-lighthouse-mobile.json` | Create | Mobile Lighthouse report |
| `docs/audits/YYYY-MM-DD-lighthouse-desktop.json` | Create | Desktop Lighthouse report |
| `docs/audits/YYYY-MM-DD-drift.md` | Create | Documented theme drift since Apr 15 |
| `docs/audits/YYYY-MM-DD-size-selector-bug.md` | Create | Mobile size selector regression findings |

---

## Task 1: Replace placeholder repo with real clone

The `~/Projects/jambys-theme/` directory currently has a placeholder `.git` and the spec doc. This task replaces it with a real clone of `andrewgoble/horizon`.

**Files:** `~/Projects/jambys-theme/` (full replacement)

- [ ] **Step 1: Backup the spec doc**

```bash
cp -r ~/Projects/jambys-theme/docs /tmp/jambys-theme-docs-backup
```

- [ ] **Step 2: Clone andrewgoble/horizon to a temp path**

```bash
git clone git@github.com:andrewgoble/horizon.git ~/Projects/jambys-theme-real
```

Expected: Clones successfully. If you get a permission error, you need to add your SSH key to the `andrewgoble` GitHub account (Settings → SSH keys) or switch to HTTPS: `git clone https://github.com/andrewgoble/horizon.git ~/Projects/jambys-theme-real`

- [ ] **Step 3: Remove the placeholder and rename**

```bash
rm -rf ~/Projects/jambys-theme
mv ~/Projects/jambys-theme-real ~/Projects/jambys-theme
```

- [ ] **Step 4: Restore the spec doc**

```bash
mkdir -p ~/Projects/jambys-theme/docs/superpowers/specs
cp /tmp/jambys-theme-docs-backup/superpowers/specs/2026-04-30-jambys-theme-project-design.md \
   ~/Projects/jambys-theme/docs/superpowers/specs/
```

- [ ] **Step 5: Verify**

```bash
cd ~/Projects/jambys-theme
git log --oneline -3
git remote -v
ls docs/superpowers/specs/
```

Expected: Git log shows Horizon commits. Remote shows `andrewgoble/horizon`. Spec file is present.

---

## Task 2: Create preview branch and verify auth

- [ ] **Step 1: Create preview branch from main**

```bash
cd ~/Projects/jambys-theme
git checkout -b preview
```

- [ ] **Step 2: Push preview to origin (auth verification)**

```bash
git push -u origin preview
```

Expected: Branch appears at `https://github.com/andrewgoble/horizon/tree/preview`. If auth fails, see Task 1 Step 2 note on SSH vs HTTPS.

- [ ] **Step 3: Confirm you are on preview**

```bash
git branch
```

Expected: `* preview` is highlighted. Never leave this branch for dev work.

---

## Task 3: Update .gitignore

- [ ] **Step 1: Add .superpowers/ to .gitignore**

Open `.gitignore` in the project root. Add this block at the end:

```
# Claude Code brainstorming artifacts
.superpowers/

# Project docs (committed to repo but not Shopify theme)
# (no entries needed — Shopify ignores non-theme files)
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers/ brainstorm artifacts"
```

---

## Task 4: Add git hook to protect main branch

This is a local-only hook — it lives in `.git/hooks/` and is never committed to the repo. It prevents accidentally pushing to `main` from any branch other than `main` itself. The ship workflow (`git checkout main && git merge preview && git push origin main`) is not blocked because it runs from `main`.

- [ ] **Step 1: Write the hook**

Create `.git/hooks/pre-push` with this exact content:

```bash
#!/bin/bash
# Prevents direct pushes to main from any branch other than main.
# Ship workflow (checkout main → merge preview → push) is still allowed.

while read local_ref local_sha remote_ref remote_sha; do
  if [[ "$remote_ref" == "refs/heads/main" ]]; then
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    if [[ "$current_branch" != "main" ]]; then
      echo ""
      echo "BLOCKED: Cannot push to remote 'main' from branch '$current_branch'."
      echo ""
      echo "Ship workflow:"
      echo "  git checkout main"
      echo "  git checkout -b backup/$(date +%Y-%m-%d)"
      echo "  git push origin backup/$(date +%Y-%m-%d)"
      echo "  git merge preview"
      echo "  git push origin main"
      echo ""
      exit 1
    fi
  fi
done
exit 0
```

- [ ] **Step 2: Make it executable**

```bash
chmod +x .git/hooks/pre-push
```

- [ ] **Step 3: Test it (dry run — should be blocked)**

```bash
git push origin preview:main --dry-run 2>&1 || true
```

Expected output contains: `BLOCKED: Cannot push to remote 'main' from branch 'preview'`

---

## Task 5: Write CLAUDE.md

- [ ] **Step 1: Create CLAUDE.md**

Create `CLAUDE.md` in the project root with this content:

```markdown
# Jambys Theme — Project Rules

Maintenance and improvement of Jambys' live Horizon theme at jambys.com.

---

## LIVE SITE GUARDRAILS — HARD STOPS

### Deploy workflow — ONLY correct method
All dev work on `preview` branch. `git push origin main` deploys live instantly.
Only update main via the ship workflow below.

### BANNED commands — Never run under any circumstances
- **`shopify theme publish`** — makes a theme live instantly, no exceptions
- **`git push origin main` directly** — ship workflow only (see below)
- **Shopify editor changes to live theme** — without pulling first and committing drift

### Shopify admin changes — require per-change written approval
Session-level blanket approval does NOT apply:
- App installs or removals
- Payment, checkout, shipping, or tax settings
- Domain or DNS changes
- Any Shopify Admin API write call outside theme files

---

## Store
- Store: `jambys-chillwear.myshopify.com`
- Public domain: `jambys.com`
- GitHub: `andrewgoble/horizon`
- Theme: Horizon v2.1.5
- Local path: `~/Projects/jambys-theme/`

## Branch model
- `preview` — all development. Push freely.
- `main` — LIVE. Shopify auto-deploys on every push.
- `backup/YYYY-MM-DD` — created from main before every ship.

## Ship workflow
1. Verify changes on Shopify preview theme (connected to `preview` branch by Andrew)
2. `git checkout main && git checkout -b backup/$(date +%Y-%m-%d) && git push origin backup/$(date +%Y-%m-%d)`
3. `git checkout main && git merge preview && git push origin main`
4. Verify on jambys.com. Return to `preview`.

## Preview theme
**NOT YET CONNECTED.** Andrew connects `preview` branch to a Shopify shadow theme
via Shopify admin → Themes → Add theme → Connect from GitHub → select `preview` branch.
Update the ID here when done: `PREVIEW_THEME_ID=`

---

## Session Start — Every Session

```bash
# On preview branch — drift check
shopify theme pull --store jambys-chillwear --theme PREVIEW_THEME_ID --path .
git diff
```

If `git diff` is non-empty: commit before other work:
```bash
git add -A && git commit -m "Theme drift: <what changed>"
```

Load MCP if doing Liquid work:
`learn_shopify_api(api: "liquid")`

---

## Shopify AI Toolkit — MCP Gates

Before writing ANY Liquid or theme JSON:
- `mcp__shopify-dev-mcp__search_docs_chunks` for the section/block/filter

After writing ANY theme file:
- `mcp__shopify-dev-mcp__validate_theme` — fix ALL errors before proceeding
- `shopify theme check --path .` — zero warnings threshold

Reference patterns: `~/Projects/aspera/theme/sections/`

---

## Horizon Silent-Failure Rules

| Never | Always use instead |
|-------|-------------------|
| `{% for block in section.blocks %}` | `{% content_for 'blocks' %}` |
| `{% include %}` | `{% render %}` |
| `img_url` / `img_tag` | `image_url` / `image_tag` |
| Liquid vars inside `{% stylesheet %}` | `{% style %}` for dynamic CSS |
| `{% doc %}` in sections | `{% doc %}` in snippets and static blocks only |

Always:
- `{{ block.shopify_attributes }}` on block root elements
- `t:` prefix in schema JSON labels → `en.default.schema.json`
- `{{ 'key' | t }}` filter keys → `en.default.json`

---

## 3-Check Rule — Before Any Infra Recommendation

1. **Current-state check** — verify current state first, never assume
2. **Evidence check** — direct support, or measurement artifact?
3. **Repo-grep check** — local code fix before backend change?

---

## CLI Reference

```bash
# Dev locally (preview theme)
shopify theme dev --store jambys-chillwear --path .

# Push to preview/shadow theme only — confirm theme ID first
shopify theme push --store jambys-chillwear --theme PREVIEW_THEME_ID --path .

# Pull (drift check)
shopify theme pull --store jambys-chillwear --theme PREVIEW_THEME_ID --path .

# Lint
shopify theme check --path .

# List all themes + IDs
shopify theme list --store jambys-chillwear
```

---

## Reference
- Aspera Horizon patterns: `~/Projects/aspera/theme/sections/`
- StickyGolf rules: `~/Projects/stickygolf-theme/CLAUDE.md`
- Design spec: `docs/superpowers/specs/2026-04-30-jambys-theme-project-design.md`
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "feat: add CLAUDE.md with project rules and live-site guardrails"
```

---

## Task 6: Write PROGRESS.md

- [ ] **Step 1: Create PROGRESS.md**

Create `PROGRESS.md` in the project root:

```markdown
## Current State

Fresh workspace setup. preview branch created and pushed to origin. CLAUDE.md written.
Preview theme not yet connected to Shopify (Andrew to do manually).
Audit in progress: drift check + Lighthouse + mobile size selector bug.

## Next Session Kickoff

Mode: `shallow`
First action: Check if Andrew has connected preview branch to Shopify shadow theme (update PREVIEW_THEME_ID in CLAUDE.md if so). Then continue audit or begin first fix.

---

## Session 1 — 2026-04-30

**Work done:**
- Cloned andrewgoble/horizon → ~/Projects/jambys-theme/
- Created preview branch
- Added CLAUDE.md, PROGRESS.md, .gitignore, pre-push hook
- Drift check (see docs/audits/)
- Lighthouse audit on jambys.com (see docs/audits/)
- Mobile size selector regression documented (see docs/audits/)
```

- [ ] **Step 2: Commit**

```bash
git add PROGRESS.md
git commit -m "feat: add PROGRESS.md session log"
```

---

## Task 7: Drift check — what changed since Apr 15

**Prerequisite:** Preview theme not yet connected to Shopify. This drift check pulls from the **live theme** (read-only) to see what changed in the Shopify editor since the last git commit on Apr 15.

- [ ] **Step 1: List themes to get the live theme ID**

```bash
shopify theme list --store jambys-chillwear
```

Note the theme ID marked `[live]`.

- [ ] **Step 2: Pull the live theme into a temp directory**

```bash
mkdir -p /tmp/jambys-live-pull
shopify theme pull --store jambys-chillwear --theme <LIVE_THEME_ID> --path /tmp/jambys-live-pull
```

- [ ] **Step 3: Diff against our local checkout**

```bash
diff -rq --exclude=".git" /tmp/jambys-live-pull ~/Projects/jambys-theme \
  --exclude="CLAUDE.md" --exclude="PROGRESS.md" --exclude=".superpowers" \
  --exclude="docs" 2>/dev/null
```

- [ ] **Step 4: Document findings**

Create `docs/audits/$(date +%Y-%m-%d)-drift.md`:

```markdown
# Theme Drift Report — YYYY-MM-DD

Comparing live Shopify theme (pulled $(date)) against andrewgoble/horizon main (last commit Apr 15 2026).

## Files changed in Shopify editor (not in git)

<!-- paste diff output here -->

## Action
[ ] Review each change — intentional editor edit or accidental?
[ ] Cherry-pick any intentional changes onto preview branch
[ ] Commit any intentional drifts as: git commit -m "Theme drift: <what changed>"
```

- [ ] **Step 5: Commit the drift report**

```bash
git add docs/audits/
git commit -m "audit: theme drift report vs Apr 15 git state"
```

---

## Task 8: Lighthouse audit on jambys.com

- [ ] **Step 1: Run mobile Lighthouse**

```bash
mkdir -p ~/Projects/jambys-theme/docs/audits
npx lighthouse https://www.jambys.com \
  --output json,html \
  --output-path ~/Projects/jambys-theme/docs/audits/$(date +%Y-%m-%d)-lighthouse-mobile \
  --form-factor mobile \
  --throttling-method simulate \
  --chrome-flags="--headless" \
  --quiet
```

Expected: Creates `docs/audits/YYYY-MM-DD-lighthouse-mobile.report.json` and `.report.html`.

- [ ] **Step 2: Run desktop Lighthouse**

```bash
npx lighthouse https://www.jambys.com \
  --output json,html \
  --output-path ~/Projects/jambys-theme/docs/audits/$(date +%Y-%m-%d)-lighthouse-desktop \
  --form-factor desktop \
  --throttling-method simulate \
  --chrome-flags="--headless" \
  --quiet
```

- [ ] **Step 3: Extract key scores**

```bash
node -e "
const mobile = require('./docs/audits/$(date +%Y-%m-%d)-lighthouse-mobile.report.json');
const desktop = require('./docs/audits/$(date +%Y-%m-%d)-lighthouse-desktop.report.json');
const cats = ['performance','accessibility','best-practices','seo'];
console.log('MOBILE:');
cats.forEach(c => console.log(' ', c, Math.round(mobile.categories[c].score * 100)));
console.log('DESKTOP:');
cats.forEach(c => console.log(' ', c, Math.round(desktop.categories[c].score * 100)));
" 2>/dev/null || echo "Run from ~/Projects/jambys-theme/"
```

- [ ] **Step 4: Document scores and top issues**

Create `docs/audits/$(date +%Y-%m-%d)-lighthouse-summary.md`:

```markdown
# Lighthouse Audit — YYYY-MM-DD

## Scores

| Category | Mobile | Desktop |
|----------|--------|---------|
| Performance | | |
| Accessibility | | |
| Best Practices | | |
| SEO | | |

## Top Mobile Performance Issues
<!-- from Lighthouse report: LCP, TBT, CLS, opportunities -->

## Top Accessibility Issues
<!-- from Lighthouse report -->

## Priority Fix List
1. 
2. 
3. 
```

- [ ] **Step 5: Commit**

```bash
git add docs/audits/
git commit -m "audit: Lighthouse baseline — mobile + desktop scores"
```

---

## Task 9: Investigate mobile size selector regression

Reported: size swatches/buttons on mobile have gotten visually much smaller. Likely a CSS regression.

- [ ] **Step 1: Find the size selector template files**

```bash
cd ~/Projects/jambys-theme
grep -rl "variant\|swatch\|size" sections/ blocks/ snippets/ --include="*.liquid" | head -20
grep -rl "variant\|swatch\|size" assets/ --include="*.css" | head -10
```

- [ ] **Step 2: Find recent changes to those files in git**

```bash
git log --oneline --since="2026-01-01" -- sections/ blocks/ snippets/ assets/ | head -20
```

Note any commits that touched variant/swatch/size-related files.

- [ ] **Step 3: Check the specific selectors for size buttons**

```bash
grep -n "variant-button\|swatch\|size-chart\|product-form__input" \
  sections/main-product.liquid blocks/ snippets/ assets/*.css 2>/dev/null | head -30
```

Look for: `font-size`, `padding`, `width`, `height`, `min-width`, `min-height` on the button/swatch elements.

- [ ] **Step 4: Compare with Aspera reference (known-good Horizon)**

```bash
grep -n "variant-button\|swatch" \
  ~/Projects/aspera/theme/sections/main-product.liquid \
  ~/Projects/aspera/theme/assets/*.css 2>/dev/null | head -20
```

- [ ] **Step 5: Document findings**

Create `docs/audits/$(date +%Y-%m-%d)-size-selector-bug.md`:

```markdown
# Mobile Size Selector Regression — YYYY-MM-DD

## Symptom
Size selector buttons on mobile are visually much smaller than expected.

## Root cause
<!-- file and line number where the regression lives -->

## Evidence
<!-- paste relevant CSS/Liquid and git blame output -->

## Proposed fix
<!-- exact CSS/Liquid change needed -->

## Files to change
- `<file>:<line>`
```

- [ ] **Step 6: Commit the findings doc**

```bash
git add docs/audits/
git commit -m "audit: mobile size selector regression investigation"
```

---

## Task 10: Push preview branch

- [ ] **Step 1: Push all committed changes on preview**

```bash
cd ~/Projects/jambys-theme
git status
git push origin preview
```

Expected: All commits from Tasks 3–9 pushed to `andrewgoble/horizon/preview`.

- [ ] **Step 2: Update PROGRESS.md with session summary and next steps**

Fill in the Session 1 section in `PROGRESS.md` with actual findings: drift files, Lighthouse scores, size selector root cause.

- [ ] **Step 3: Final commit and push**

```bash
git add PROGRESS.md
git commit -m "docs: Session 1 summary — audit complete"
git push origin preview
```

---

## Self-Review Notes

- **Auth risk:** Task 1 explicitly tests push auth before any real work. If it fails, the plan stops there.
- **Preview theme ID:** All commands referencing `PREVIEW_THEME_ID` are in audit (read-only pull) or future sessions. No writes to Shopify until Andrew connects the branch.
- **Drift check uses live theme pull to temp dir** — never overwrites working copy.
- **Lighthouse requires Node/npx** — if not installed: `brew install node` or use PageSpeed Insights API at `https://pagespeed.web.dev/` manually and paste scores into the summary doc.
- **`.git/hooks/pre-push` is local only** — not committed, must be re-created on fresh clone. Document in CLAUDE.md if needed.
