# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog for grybkov.com, built with Hugo and the PaperMod theme. Deployed to GitHub Pages via GitHub Actions on push to `main`.

## Commands

```bash
make watch             # Dev server with drafts visible (http://localhost:1313)
make watch-published   # Dev server showing only published posts
make build             # Production build (output: public/)
make update-theme      # Download latest PaperMod theme

make serve             # Headless test server (drafts + hugo.test.yaml), used by Playwright
make test              # Run all Playwright tests (npm test)
make test-visual       # Visual regression tests only
make test-install      # Install npm deps + Chromium
make screenshots       # Regenerate snapshot baselines (macOS locally + Linux via Docker)
```

Hugo and Node are both managed via [mise](https://mise.jdx.dev/) (`mise.toml` pins `hugo = "latest"`, `node = "22.22.0"`). All `make` targets run Hugo through `mise exec`.

### Testing

Playwright drives three suites in `tests/`, run across three viewports (mobile/tablet/desktop) defined in `playwright.config.ts`:

```bash
npm run test:visual    # tests/visual.spec.ts — full-page screenshot diffs
npm run test:a11y      # tests/accessibility.spec.ts — axe-core checks
npm run test:links     # tests/links.spec.ts — link integrity
npm run test:update    # regenerate screenshot baselines
```

- Playwright auto-starts the server via `make serve`, which loads `hugo.yaml` + `hugo.test.yaml` (the latter shrinks pagination to 3 for deterministic pages).
- Visual tests stabilize dynamic content (post titles, dates, summaries) by overwriting DOM text before capture, so baselines don't churn on new posts. When adding pages to the snapshot set, edit the `pages` array in `tests/visual.spec.ts`.
- Snapshots are platform-specific (`-darwin`/`-linux` suffixes). CI runs on Linux, so Linux baselines must exist — `make screenshots` regenerates both via Docker.

## Favicons

`scripts/generate-favicons.sh` regenerates the entire favicon set in `static/` from the "{G}" mark. It renders the glyph from SF Pro Display, traces it to font-independent vector paths with potrace, and derives all raster sizes. Requires `rsvg-convert`, `potrace`, ImageMagick (`magick`), `python3`, and the SF Pro Display font.

## Architecture

- **hugo.yaml** — Site config: metadata, theme settings, menus, markup options
- **content/posts/*.md** — Blog posts (markdown with YAML front matter)
- **layouts/** — Template overrides for the PaperMod theme (home_info, header, list page, extend_head, comments)
- **layouts/partials/comments.html** — giscus comment widget (GitHub Discussions-backed), rendered on posts
- **static/** — Static assets served at site root (avatar, images, generated favicons)
- **themes/PaperMod/** — Theme (git submodule, also installable via `make update-theme`)
- **archetypes/default.md** — Template for `hugo new` posts (creates as draft by default)

## Content Conventions

Posts use this front matter structure:
```yaml
title: "Post Title"
date: YYYY-MM-DD
description: "SEO/meta description"
summary: "Short summary shown in post list"
tags: ["tag1", "tag2"]
author: "Illia Grybkov"
draft: true  # Remove or set false to publish
```

## Deployment

`.github/workflows/hugo.yml` has three jobs: **test** (runs Playwright on every push and PR to `main`), **build** (`make build`, skipped on PRs), and **deploy** (to GitHub Pages, push only). So a push to `main` runs tests → builds → deploys; a PR runs tests only. `main` is the live branch — work happens on feature branches that PR into `main`; there is no separate development branch.
