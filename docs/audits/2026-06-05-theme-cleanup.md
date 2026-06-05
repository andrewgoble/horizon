# Shopify Theme Cleanup Audit

**Date:** 2026-06-05
**Store:** jambys-chillwear.myshopify.com
**Current count:** 84 themes (1 live + 83 unpublished)
**Cap:** 20 themes
**To delete:** 64+

## Approach

No content-level duplicates were found among the 19 themes we backed up locally — each had unique customizer state. So this cull is judgment-based on **name pattern + age**, not dedup.

Local safety:
- ✅ Live theme snapshotted at `/tmp/jambys-live-snapshot-2026-06-05/`
- ✅ 14 oldest unpublished themes backed up at `/tmp/jambys-theme-backups/12390..._*/` through `/tmp/jambys-theme-backups/12433..._*/`
- ✅ 5 newest non-github themes backed up
- ✅ Andrew's external backup app covers the middle ~60 themes

## Recommendation: KEEP 5 + Ricardo sandbox = 6 used / 14 free slots

| Keep? | ID | Name | Why |
|-------|-----|------|-----|
| ✅ LIVE | 129845231701 | `horizon/main` | Live theme. Cannot delete. |
| ✅ KEEP | 130174517333 | `horizon/develop` | GitHub-connected dev theme. |
| ✅ KEEP | 130534015061 | `DEFAULT BACKUP \| Jambys 9-30-25` | Explicit rollback safety net (Sep 2025). |
| ✅ KEEP | 123908587605 | `Main Stable Theme` | Oldest known-good stable. Belt-and-suspenders rollback. |
| ✅ KEEP | 134705479765 | `horizon/main with Installments message` | Most recent change; unknown unique value. Backed up locally but worth keeping live until verified. |
| ➕ NEW | (TBD) | `Ricardo Sandbox — 2026-06-05` | About to be pushed for Ricardo's work. |

## Recommendation: DELETE 78 themes

I'm grouping deletions into 6 categories. Approve by category, not theme-by-theme.

### Category A: "S31" series — PDP/Gender Split/Backorder WIP (March–April 2025)

19 themes from a long-completed work stream. All on the live site or abandoned 14+ months ago.

| ID | Name |
|----|------|
| 124306751573 | S31 \| PDP & Search \| FIX > Backorder & URL[bkup] |
| 124326477909 | S31 - Fix overlapping images PDP |
| 124326543445 | S31 - Nav & Sitewide + fix PDP [backup] |
| 124328804437 | S31 - Apply Jambys Styles Modal |
| 124337815637 | S31 - Model Sizing pdp + Announcement bar |
| 124339912789 | S31 - Model Sizing pdp + Announcement + Fix |
| 124344664149 | S31 - Hotfix + Deploy + Announcement [Backup] |
| 124349874261 | S31 - Fix out of stock |
| 124351578197 | S31 - Fix Out of Stock [Backup] |
| 124359016533 | S31 - Swatch Order +  Styles Modal [Backup] |
| 124382183509 | S31 - New Edits in the PDPs |
| 124395782229 | S31 - New Megamenu [Backup] |
| 124425568341 | S31 - Change Filters on PLPs |
| 124430450773 | S31 - Change "Account" to icon |
| 125986013269 | S31 \| PDP \| FIX > Gender Split > [IMPROVEMENT] |
| 127599149141 | S31 \| PDP \| Feature \| Gender Split > Toggle |
| 127966019669 | S31 \| PDP \| Gender Split & Backorder [BKU] |
| 128183173205 | S31 \| PDP \| Feature \| Gender Split Improvement |
| 128495091797 | S31 \| PDP \| FIX > GIFT CARD (RISE.AI) |
| 129353678933 | Copy of S31 \| PDP \| Feature \| Gender Split Impr... |

### Category B: "Jambys-Shopify-Theme/" + "Cristian" feature branches

7 themes — old branch-style themes, Cristian's WIP from spring 2025.

| ID | Name |
|----|------|
| 124075835477 | Jambys-Shopify-Theme/rollback |
| 124319105109 | Jambys-Shopify-Theme/cristian-shop-by-subtype |
| 124319268949 | Jambys-Shopify-Theme/cristian-shop-by-sex |
| 124335980629 | Jambys-Shopify-Theme/cristian-fabrics-menu |
| 124336013397 | Jambys-Shopify-Theme/cristian-deletion-by-subtype |
| 124339519573 | Jambys-Shopify-Theme/feature/jean-deploy-collec... |
| 124339978325 | Jambys-Shopify-Theme/cristian-deploy-home-slider |

### Category C: "DTC *" backup themes

3 themes — March/April 2025 work, all marked [Backup].

| ID | Name |
|----|------|
| 124313698389 | DTC Shop-subtype & mega-menu \| [03/13] [Backup] |
| 124325855317 | DTC Nav & Sitewide test \| [03/21] |
| 124343418965 | DTC Hotfix + Deployments \| 04/05 [Backup] |

### Category D: Search/Menu fix iteration chain

5 themes — incremental backups of the same fix iteration, likely shipped or abandoned.

| ID | Name |
|----|------|
| 125024239701 | Fix Search and Menu Navigation [backup] |
| 125052649557 | Search and Menu Navigation + Fix |
| 125071589461 | Fix Search and Menu Navigation 2.0 - 1/31[bkup] |
| 125166420053 | Fix Search and Menu Navigation + AB Test PDP |
| 125260103765 | Fix Search and Menu + AB Test - 2/10 [backup] |

### Category E: One-off iteration / feature themes (Apr 2025 – May 2025)

30 themes — small feature themes, AB tests, and version backups. All superseded by what's on `horizon/main` today.

| ID | Name |
|----|------|
| 124388638805 | Copy to add new progress bar |
| 124428746837 | [Status] C/o Megamenu + Model Sizing and Checkout |
| 124456403029 | Change subtitle text \| collection level |
| 124458106965 | Change subtitle text \| collection level [Backup] |
| 124466331733 | [PDP] Fix how Colors Show |
| 124478455893 | Wishlist on collection |
| 124485730389 | Wishlist on collection [Okendo] [Backup] |
| 124513976405 | Wishlist on collection [Okendo] + 3-Pack Jambys |
| 124514205781 | Wishlist [Okendo] + 3-Pack Jambys (sync)[backup] |
| 124549922901 | 7 pack jambys - dev |
| 124567191637 | Save X% & Bundle 5 pack |
| 124573024341 | Show backorder in the cart  & Move backorder |
| 124579643477 | PMDIG \| New backorder updates + 5 pack bundles... |
| 124595503189 | Navigation update - SALE option [Backup] |
| 124611264597 | SALE option + Add back the free gift cart [backup] |
| 124617588821 | Fix Search Button  [Backup] |
| 124620505173 | Fix Search Button + Change SALE badges color |
| 124629319765 | Swatches not showing correctly |
| 124646621269 | [Rivo] Swatches mobile |
| 124649144405 | [Rivo] Jan 6 [Backup] |
| 124946219093 | A/B test first image in gallery - setup |
| 124959653973 | Copy of [Rivo] Jan 6 [Backup] |
| 124960669781 | Fix Add to Cart \| 2025 [backup] |
| 125596794965 | AB Test - 2/10 & Homepage - second [backup] |
| 125751918677 | Enlarge the color and size container |
| 125849469013 | Remove Script -  Find your fit |
| 125985652821 | Footer background and font color update |
| 126727127125 | A/B test for the progress bar |
| 127018500181 | FAQ for each product type |
| 127183028309 | Make new Rise.Ai gift card work on website. |
| 127259115605 | FAQs + Rise.Ai gift card 20/05 |
| 127303188565 | FAQs + Rise.Ai gift card 22/05 |

### Category F: Stale "main" copies + agency backups

9 themes — old "cleanup", "main copy", and agency-era backups. All superseded by current `horizon/main`.

| ID | Name |
|----|------|
| 123908620373 | Develop Theme - WIP (oldest) |
| 128106659925 | Horizon |
| 129224507477 | Copy of Main Stable Theme |
| 129549303893 | Jambys-Cleanup-Theme/main |
| 129549467733 | jambys-shopify-theme-main |
| 129552580693 | jambys-shopify-theme-main (dup) |
| 129553432661 | Jambys-Cleanup-Theme/BASE |
| 130587066453 | 10/2 Horizon (Duplicated from /develop) |
| 131333914709 | 11/17 Backup from Rivo Download |
| 131708977237 | Graftstudio backup |
| 132022468693 | Copy of horizon/main |
| 133551063125 | Copy of horizon/main |

## Summary

- **Approve all 6 categories** → 78 deletions → end at 6 themes (5 keepers + Ricardo sandbox) / 20 cap.
- **Approve A–E only** → 73 deletions → end at 11 themes (keep some Cat F recent copies for safety).
- **Anything in any category you want to spare** → call it out, I'll skip.

Once you confirm, I'll run `shopify theme delete --theme <id>` for each, then push the sandbox.
