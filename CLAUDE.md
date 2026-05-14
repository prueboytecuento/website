# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Pruebo y Te Cuento" is a Spanish-language food, lifestyle, and product review blog built with Hugo (v0.161+). It is authored by Paula Hernández and deployed on Netlify. Content is managed via Netlify CMS with an editorial workflow (PRs through GitHub).

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

# Visual smoke test (requires hugo server running on port 1313)
node tests/visual-check.mjs
```

The theme SCSS toolchain uses Dart Sass (`sass` v1.x) and `bootstrap-sass` v3.4.x. The SCSS source files are not in the repo — only the pre-compiled CSS in `themes/hugo-nederburg-theme/static/css/` is used at build time.

## Architecture

- **config.toml** — Main Hugo config: site metadata, menus, social links, Disqus, Google Analytics, pagination (6 per page), permalink pattern `/:year/:month/:title/`
- **content/post/** — Blog posts as Markdown files, named `YYYY-MM-DD-slug.md`
- **content/about/** — About page
- **static/images/uploads/** — All post images (referenced in front matter as `/images/uploads/...`)
- **static/admin/** — Netlify CMS interface (`config.yml` defines the content schema and editorial workflow)
- **themes/hugo-nederburg-theme/** — Full theme with layouts, partials, and static assets. Contains its own `package.json` for SCSS compilation.
- **content/_redirects** — Netlify redirect rules (domain aliases)

### Theme Template Structure

The theme has two layers of taxonomy templates — be aware of which one you're editing:

- `taxonomy/category.html`, `taxonomy/tag.html` — Full-page layouts for individual category/tag pages (e.g., `/categories/comer-y-beber/`). These define their own `<html>` shell and do **not** use `baseof.html`.
- `_default/baseof.html` — Base layout used by the homepage and single post pages.
- `_default/taxonomy.html` — Stub for taxonomy term index pages (e.g., `/categories/`). Currently a placeholder; not linked from navigation.
- `partials/category.html`, `partials/tag.html` — The actual post-listing logic, included by the taxonomy full-page templates above.

Key partials: `head.html` (meta, CSS, analytics), `header.html` (site title, primary menu), `topnavigation.html` (category bar, social icons), `footer.html` (social icons, copyright), `schema.html` (JSON-LD structured data, only rendered on single pages), `pagination.html`.

## Hugo Compatibility Notes

This theme was originally written for Hugo ~v0.34. It was updated in May 2025 to work with Hugo v0.161. Key migration pitfalls to watch for:

- **No `_internal/google_analytics_async.html`** — Removed in modern Hugo. Use `_internal/google_analytics.html`.
- **No `.RSSLink` or `.Site.RSSLink`** — Use `{{ with .OutputFormats.Get "rss" }}{{ .Permalink }}{{ end }}`.
- **No `.Site.LanguageCode`** — Use `.Site.Language.Locale`.
- **No `.Data.Pages`** — Use `.Pages` directly.
- **`preserveTaxonomyNames` removed** — No longer needed; Hugo preserves taxonomy names by default.
- **Menu item `.URL`** — Still valid on menu entries. Do not confuse with the deprecated `.Page.URL`. Accessing `.Page.RelPermalink` on menu entries will nil-pointer if the entry has no backing page.
- **`schema.html` JSON-LD** — Must produce valid JSON inside `<script>` tags or Hugo's template parser will reject the file with a "non-text context" error.

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

## Testing

`tests/visual-check.mjs` is a Playwright smoke test that checks the homepage, a single post page, and a category page. It verifies that key elements render (header, footer, post cards, images, article body) and saves screenshots to `tests/screenshots/` (git-ignored).

```bash
# One-time setup
npm i -D playwright && npx playwright install chromium

# Run (with hugo server already on port 1313)
node tests/visual-check.mjs
```

Set `BASE_URL` env var to override the default `http://127.0.0.1:1313`.

## Key Integrations

- **Disqus** comments (shortname: `prueboytecuento`)
- **Google Analytics** — Currently uses a UA- tracking ID. GA4 migration is pending.
- **FormSpree** for contact form
- **Gravatar** for author image
