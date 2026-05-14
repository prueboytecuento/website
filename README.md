# Pruebo y Te Cuento
Tasting &amp; testing | Mirar, oler, tocar, probar
https://prueboytecuento.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/227e4fa2-d5cf-48ec-82eb-a9bb83e1f021/deploy-status)](https://app.netlify.com/sites/pedantic-sinoussi-576cfb/deploys)

## Development

```bash
hugo server          # start local dev server on http://localhost:1313
hugo                 # build static site to /public
```

## Visual Smoke Test

A Playwright script lives in `tests/visual-check.mjs`. It loads the homepage, a single post, and a category page, runs basic assertions, and saves screenshots to `tests/screenshots/`.

```bash
npm i -D playwright && npx playwright install chromium   # one-time setup
hugo server --port 1313 &                                # start dev server
node tests/visual-check.mjs                              # run the test
```

Screenshots are git-ignored; they are generated fresh on each run.