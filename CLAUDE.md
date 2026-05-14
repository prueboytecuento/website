# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Pruebo y Te Cuento" is a Spanish-language food, lifestyle, and product review blog built with Hugo. It is authored by Paula Hernández and deployed on Netlify. Content is managed via Netlify CMS with an editorial workflow (PRs through GitHub).

- **Site:** https://prueboytecuento.com
- **Language:** Spanish (es-es)
- **Hugo theme:** hugo-nederburg-theme (Bootstrap-Sass based, in `themes/`)

## Build & Development Commands

```bash
# Run local dev server
hugo server

# Build static site (outputs to /public)
hugo

# Compile theme SCSS to CSS (run from themes/hugo-nederburg-theme/)
npm run build-css

# Watch SCSS for changes (run from themes/hugo-nederburg-theme/)
npm run watch-css
```

## Architecture

- **config.toml** — Main Hugo config: site metadata, menus, social links, Disqus, Google Analytics, pagination (6 per page), permalink pattern `/:year/:month/:title/`
- **content/post/** — Blog posts as Markdown files, named `YYYY-MM-DD-slug.md`
- **content/about/** — About page
- **static/images/uploads/** — All post images (referenced in front matter as `/images/uploads/...`)
- **static/admin/** — Netlify CMS interface (`config.yml` defines the content schema and editorial workflow)
- **themes/hugo-nederburg-theme/** — Full theme with layouts, partials, SCSS, and JS. Contains its own `package.json` for SCSS compilation.
- **content/_redirects** — Netlify redirect rules (domain aliases)

## Post Front Matter Schema

```yaml
title: string
showonlyimage: boolean (true)
date: datetime
image: /images/uploads/filename.jpg
rating: 1-5
tags: [list]
categories: [list]  # e.g., "COMER Y BEBER", "MODA"
weight: 0
```

Posts use `<!--more-->` to mark the excerpt/teaser boundary.

## Content Management

Most content changes come through Netlify CMS (at `/admin/`), which creates PRs on the `master` branch via Git Gateway. The CMS slug template is `{{year}}-{{month}}-{{day}}-{{slug}}` with ASCII encoding and accent cleaning.

## Key Integrations

- **Disqus** comments (shortname: `prueboytecuento`)
- **Google Analytics** (UA-142840447-1)
- **FormSpree** for contact form
- **Gravatar** for author image
