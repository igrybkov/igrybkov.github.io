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
```

Hugo is managed via [mise](https://mise.jdx.dev/) (`mise.toml` pins `hugo = "latest"`). All `make` targets run Hugo through `mise exec`.

## Architecture

- **hugo.yaml** — Site config: metadata, theme settings, menus, markup options
- **content/posts/*.md** — Blog posts (markdown with YAML front matter)
- **layouts/** — Template overrides for the PaperMod theme (home_info, header, list page, extend_head)
- **static/** — Static assets served at site root (avatar, images)
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

Push to `main` triggers `.github/workflows/hugo.yml`, which builds with `make build` and deploys to GitHub Pages. The main git branch is `master`; the deploy branch is `main`.
