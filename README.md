# RekenRaket

## Development

Static, client-only app (no bundler, no backend). No npm package is imported by anything under `src/`; the tooling below is dev-only.

```bash
npm install
npm run test:unit          # node:test against src/domain/, src/db.js, src/store.js
npx playwright install webkit
npm run test:e2e           # Playwright, WebKit only
```

Open `index.html` via a static file server (e.g. `python3 -m http.server`) to run the app locally.
