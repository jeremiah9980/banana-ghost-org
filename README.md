# Bombers Fastpitch — Team Hub

> **CTX Bombers Meza** · 10U Select Fastpitch Softball · Georgetown, Texas  
> *Built Different • Play Fast • Finish Strong*

A fully-featured GitHub Pages team site with an integrated CMS, automated sports-data sync, player-profile generation, NCS tournament tracking, and a GameChanger schedule/stats dashboard.

---

## Live Site

```
https://jeremiah9980.github.io/bombers/
```

---

## What This Repo Is

| Layer | What it does |
|---|---|
| **Public site** | Static HTML/CSS/JS pages hosted on GitHub Pages |
| **CMS** | Browser-based admin dashboard (`/cms/admin/`) to manage all page content |
| **Content JSON** | `cms/content/bombers-site.json` — single source of truth for every public page |
| **Scripts** | Node.js CLI tools to import rosters, schedules, and NCS data; generate player pages |
| **GitHub Actions** | Daily automated GameChanger stats sync committed back to the repo |
| **AI Assistant** | Local draft helper (+ optional Cloudflare Worker for real OpenAI generation) |

---

## Repository Structure

```
.
├── index.html                    # Home page
├── roster.html                   # Team roster grid
├── player-profile.html           # Dynamic player profile (query-string driven)
├── about.html
├── board.html
├── bylaws.html
├── coaching.html
├── contact.html
├── finances.html
├── fundraising.html
├── policies.html
├── rallyiq.html
│
├── players/                      # Generated static player pages
├── roster/                       # Roster sub-site
├── ncs-monitor/                  # NCS standings monitor
├── ncs-tracker/                  # NCS tournament dashboard
│
├── assets/
│   ├── css/                      # Stylesheets (style.css, team-primetime.css, …)
│   ├── js/                       # Renderers, nav, sports-sync, social-embed
│   ├── img/                      # Logos, team banner, player photos
│   └── data/                     # Auto-updated JSON data files (stats, schedule)
│
├── cms/
│   ├── admin/                    # CMS dashboard (index.html, app.js, ai-assistant.js)
│   ├── content/
│   │   └── bombers-site.json     # ← Primary content file (edit via CMS or directly)
│   ├── schema/
│   │   └── bombers-site.schema.json
│   └── workers/
│       └── ai-content-worker.js  # Cloudflare Worker for AI generation (optional)
│
├── scripts/
│   ├── validate-bombers-content.mjs       # Validates content JSON before publish
│   ├── import-roster-csv.mjs              # Bulk roster import from CSV
│   ├── import-gamechanger-manual-export.mjs
│   ├── import-ncs-manual-export.mjs
│   ├── generate-player-pages.mjs          # Generates players/<id>/index.html
│   ├── fetch-gamechanger-schedule.mjs
│   └── fetch-gamechanger-stats.mjs
│
├── docs/
│   └── SPEC-2-bombers-cms-repo-integration.md
│
├── .github/
│   └── workflows/
│       └── gamechanger-stats-sync.yml     # Daily stats refresh (7:15 AM CT)
│
├── PLAN.md                       # Banana Ghost season plan (Director Board)
├── README-CMS-UPGRADE.md         # CMS drop-in upgrade guide
└── _config.yml                   # Jekyll config (GitHub Pages)
```

---

## Quick Start

### 1. Edit Content via CMS

Open the CMS dashboard locally:

```
cms/admin/index.html
```

Edit Home, Team Info, Roster, Player Profiles, Schedule, NCS, Social, Fundraising, and SEO fields. Then:

1. Click **Validate**
2. Click **Export for GitHub**
3. Replace `cms/content/bombers-site.json` with the exported file
4. Commit and push

### 2. Validate Content Before Publishing

```bash
node scripts/validate-bombers-content.mjs cms/content/bombers-site.json
```

This blocks common mistakes — including publishing player profiles without guardian media release approval.

### 3. Import Roster from CSV

```bash
node scripts/import-roster-csv.mjs roster.csv cms/content/bombers-site.json
```

Expected CSV headers:

```
id,jerseyNumber,firstName,lastInitial,displayName,positions,photo,guardianMediaRelease,profileEnabled,oneLine,bio
```

### 4. Generate Static Player Pages

```bash
node scripts/generate-player-pages.mjs
```

Creates `players/<player-id>/index.html` for every player with both:

```json
"profileEnabled": true,
"guardianMediaRelease": true
```

### 5. Import GameChanger Schedule (Manual Export)

```bash
node scripts/import-gamechanger-manual-export.mjs gamechanger-schedule.csv cms/content/bombers-site.json
```

Expected CSV headers:

```
date,time,opponent,location,type,status,scoreFor,scoreAgainst,result
```

### 6. Import NCS Tournament Data

```bash
node scripts/import-ncs-manual-export.mjs ncs-tournaments.json cms/content/bombers-site.json
```

---

## Automated Stats Sync

The GitHub Actions workflow `.github/workflows/gamechanger-stats-sync.yml` runs daily at **7:15 AM Central** during the season. It:

1. Pulls public GameChanger stat data via `scripts/fetch-gamechanger-stats.mjs`
2. Writes `assets/data/gamechanger-stats.json`
3. Commits and pushes if the data changed

To trigger manually: **Actions → GameChanger Stats Sync → Run workflow**.

---

## AI Content Assistant

The CMS dashboard includes a local drafting helper for announcements, game recaps, social captions, player bios, sponsor thank-yous, and tournament previews.

For real OpenAI-powered generation, deploy `cms/workers/ai-content-worker.js` as a **Cloudflare Worker** with the `OPENAI_API_KEY` secret, then paste the Worker URL into the CMS AI endpoint field.

> ⚠️ Never put an OpenAI API key directly into public GitHub Pages JavaScript files.

---

## Deployment

This site is hosted as a **GitHub Pages static site**. No server-side code is executed in production.

```
Settings → Pages → Source: Deploy from branch → main → / (root)
```

The CMS dashboard (`/cms/admin/`) is also static. Treat it as a local tool or protect it with Cloudflare Access or a private repository/branch for real security.

---

## Security & Privacy

- Player profiles are **never published** unless both `profileEnabled` and `guardianMediaRelease` are `true` in the content JSON.
- The content validator enforces this rule before any publish step.
- API keys (OpenAI, etc.) must **never** be committed to this repository.
- Use a Cloudflare Worker or equivalent backend to proxy AI calls.

---

## Season Plan

See [`PLAN.md`](PLAN.md) for the Banana Ghost Director Board season plan, roster, practice model, uniform options, and budget snapshot.

---

## CMS Upgrade Guide

See [`README-CMS-UPGRADE.md`](README-CMS-UPGRADE.md) for the full CMS integration guide, including how to connect existing pages to the content renderer, add mount points, and use the publishing workflow.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Hosting | GitHub Pages (static) |
| Frontend | Vanilla HTML / CSS / JS |
| Icons | Tabler Icons (CDN) |
| CMS | Custom browser-based dashboard |
| Content store | JSON (`cms/content/bombers-site.json`) |
| Automation | GitHub Actions + Node.js scripts |
| AI drafting (optional) | Cloudflare Worker → OpenAI API |
