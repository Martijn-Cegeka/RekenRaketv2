---
title: 'Project Foundation & Home with Empty Fuel Tanks'
type: 'feature'
created: '2026-09-11'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context: []
baseline_commit: '53d390efe66258b578255490a0b176ce1073e689'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The repo has no application code yet. Tiebe needs a Home screen showing his 5 fuel tanks so he always has a starting point, and the project needs the Architecture Spine's structural seed (domain/store/db/components layers) to build on.

**Approach:** Scaffold the exact structural seed from the Architecture Spine, implement `db.js` (IndexedDB, sole schema owner) and `domain/card-generator.js` (pure, generates default 1-1-range cards for all 4 operations into Box 1), wire `store.js` to load/derive per-box counts, and render `rr-fuel-tanks` on the Home screen via `main.js`/`index.html` using the DESIGN.md tokens.

## Boundaries & Constraints

**Always:** Follow AD-1..AD-5 (Store-Mediated Web Components): only `db.js` touches IndexedDB; only `store.js` calls `domain/` and `db.js`; components are Shadow DOM, render-only, no direct DB/domain access. Domain functions are pure, DOM-free, no async. Ship no npm package under `src/`. Use `rem` for text sizing; no red anywhere; radii/spacing/colors from DESIGN.md tokens. Card id format `{operation}:{operandA}:{operandB}`. Retry cap (3) and box count (5) are named constants in `src/domain/` (even though unused until later stories, define box count now since `db.js`/fuel-tanks need it).

**Never:** No Run/Liftoff/Settings behavior (Stories 1.2–1.6, Epic 2) — those components exist only as empty/minimal placeholders satisfying the structural seed, not functional screens. No session-start CTA wiring (no Due-card computation exists yet — Story 1.2). No service worker. No build step/bundler.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fresh IndexedDB, first load | No existing DB | `db.js` runs `onupgradeneeded`, creates `cards` object store; `card-generator.js` seeds 4 cards (one per operation, range 1-1) all in Box 1 | N/A |
| Card generation at default range | operation=addition/subtraction/multiplication/division, range min=1,max=1 | Exactly one valid card per operation (subtraction: minuend>=subtrahend; division: exact quotient); each card `{ id, box: 1 }` | Range producing zero valid pairs for an operation returns no card for it (not an error) |
| Fuel tank fill proportions | Box 1 has 4 cards, Boxes 2-5 have 0, total deck = 4 | `rr-fuel-tanks` renders 5 tanks; Box 1 fill = 100%, Boxes 2-5 fill = 0% | N/A |
| Home screen viewed without starting a session | App loaded, no session started | Fuel tanks are visible immediately on Home; no session/run state required | N/A |
| Reload with existing DB | DB already seeded from a prior load | `db.js` does not reseed or duplicate cards; existing box distribution is read as-is | N/A |

</frozen-after-approval>

## Code Map

- `index.html` -- new; single entry point, `<script type="module" src="src/main.js">`, no other markup (components mount themselves).
- `manifest.webmanifest` -- new; name/icon metadata for "Add to Home Screen", no service worker reference.
- `src/main.js` -- new; app shell: creates `store.js` instance, waits for initial state load, mounts `rr-fuel-tanks` (and stub `rr-run-view`/`rr-liftoff`/`rr-settings` behind view-switching, inactive by default) into `document.body`.
- `src/store.js` -- new; sole caller of `db.js`/`domain/`; exposes an init/load function returning per-box card counts and total deck size; components call read-only getters, no direct field mutation.
- `src/db.js` -- new; sole IndexedDB owner. One `onupgradeneeded` chain, version 1, object store `cards` (keyPath `id`, plus index on `box`). Seeds default deck via `card-generator.js` only when the store is empty.
- `src/domain/card-generator.js` -- new; pure function(s) generating cards for one/all operations given a Number-Range map; enforces subtraction (minuend>=subtrahend) and division (exact quotient) constraints; all generated cards start `box: 1`.
- `src/domain/leitner.js` -- new; exports box-count constant (5) and retry-cap constant (3) per Architecture naming convention; box-transition functions are stubs/no-ops until Story 1.3/1.4 (not called yet).
- `src/domain/tiers.js` -- new; empty/stub module reserved for Story 1.5 flight-tier logic (structural seed only).
- `src/components/rr-fuel-tanks.js` -- new; Custom Element, Shadow DOM, `render(state)` showing 5 tanks (rounded/lg, fuel-teal fill, border-hairline track) sized by `box count / total deck size`; no numeric/percentage labels.
- `src/components/rr-run-view.js`, `rr-liftoff.js`, `rr-settings.js` -- new; minimal Custom Element stubs (structural seed only, not rendered/active in this story).
- `src/styles/base.css` -- new; DESIGN.md tokens as CSS custom properties (colors, spacing scale, radii) plus `rem`-based base typography; imported/linked for use by Shadow DOM components (e.g. via `adoptedStyleSheets` or inlined `<style>` referencing the same custom-property values).
- `tests/unit/` -- new; `node:test` files for `card-generator.js` (default-range generation, subtraction/division constraints) and `leitner.js` constants.
- `tests/e2e/` -- new; Playwright (WebKit) config + one smoke test: load Home, assert 5 `rr-fuel-tanks` tanks render.
- `package.json` -- new; `"type": "module"`, `devDependencies` for `@playwright/test`; npm scripts `test:unit` (`node --test tests/unit`) and `test:e2e` (`playwright test`).

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- create with `type: module`, Playwright devDependency, `test:unit`/`test:e2e` scripts -- enables the test stack without shipping npm packages under `src/`
- [x] `src/domain/card-generator.js` -- implement pure generation with range/constraint rules -- FR-12 groundwork, drives default deck
- [x] `src/domain/leitner.js` -- define `BOX_COUNT = 5`, `RETRY_CAP = 3` constants -- avoids magic numbers per Architecture convention
- [x] `src/domain/tiers.js` -- create empty stub module -- completes structural seed
- [x] `src/db.js` -- implement IndexedDB open/`onupgradeneeded`/seed-if-empty/typed CRUD for `cards` -- sole schema owner (AD-5)
- [x] `src/store.js` -- implement init/load calling `db.js`, expose per-box counts + total deck size -- sole state owner (AD-1)
- [x] `src/styles/base.css` -- define DESIGN.md tokens as custom properties, `rem` typography -- shared styling foundation
- [x] `src/components/rr-fuel-tanks.js` -- implement Shadow DOM render of 5 proportional tanks -- FR-1, FR-2
- [x] `src/components/rr-run-view.js`, `rr-liftoff.js`, `rr-settings.js` -- minimal stub Custom Elements, unmounted -- complete structural seed only
- [x] `src/main.js` -- wire store + mount `rr-fuel-tanks` on load -- FR-2 (visible without starting a session)
- [x] `index.html`, `manifest.webmanifest` -- create entry point + PWA manifest -- NFR-1, NFR-3
- [x] `tests/unit/card-generator.test.js`, `tests/unit/leitner.test.js` -- cover I/O matrix scenarios -- AD-2 (domain testability)
- [x] `tests/e2e/home.spec.js` -- Playwright smoke test for Home fuel-tank render -- confirms end-to-end wiring (written; could not execute — see Implementation Notes)

**Acceptance Criteria:**
- Given a fresh checkout, when the project is inspected, then every structural-seed file/folder listed in the Architecture Spine exists.
- Given the app is loaded in a browser, when it runs, then no `npm` package is imported by anything under `src/` and no backend/service worker is present.
- Given a fresh IndexedDB, when the app first opens, then `db.js` seeds exactly one card per operation at the default 1-1 range, all in Box 1.
- Given the Home screen, when rendered, then `rr-fuel-tanks` shows 5 tanks with fill proportional to box contents and no numeric/percentage labels, visible without starting a Daily Session.
- Given `base.css`, when applied, then colors/spacing/radii come from the DESIGN.md token values and no red appears anywhere.

## Implementation Notes

- All structural-seed files implemented per the Architecture Spine; dependency direction verified (components never import `domain/`/`db.js`; `rr-fuel-tanks` receives box counts/total via `render(state)` from `store.js`).
- `card-generator.js`: single `{min,max}` range applied to both operands per operation; `generateOperationCards(operation, range)` and `generateDeck(rangesByOperation)` exported, defaulting to 1-1 per operation.
- `db.js`: `cards` object store (keyPath `id`, index `box`), version 1, single `onupgradeneeded`; seeds via `card-generator.js` only when the store is empty (checked via `getAll().length`).
- `store.js`: `createStore()` exposes `init()`, `getState()`, `subscribe(listener)`; derives `boxCounts`/`totalCards` from all cards, keyed off `BOX_COUNT` from `domain/leitner.js`.
- `rr-fuel-tanks.js` builds tank count from `state.boxCounts.length` (not a hardcoded `5`) so the box-count constant stays owned solely by `domain/leitner.js`, per the "components never import domain/" rule in the dependency diagram.
- `main.js` mounts all four screen elements (fuel tanks active, others `hidden`) only after `store.init()` resolves, satisfying "visible without starting a session" while keeping Run/Liftoff/Settings inert.
- Unit tests (`node:test`): 9/9 passing, covering default-deck generation, subtraction/division constraints, the zero-valid-pairs edge case, `db.js` fresh-seed + no-duplicate-reseed-on-reopen (via `fake-indexeddb`, added as a devDependency — dev-only per AD-3), and `store.js` box-count/fill-proportion derivation (Box 1 100%, others 0%).
- **Note (resolved):** `npm test:unit`/`node --test tests/unit` (directory form) failed with a spurious `MODULE_NOT_FOUND` on Node v24.9.0 in the implementation subagent's sandbox; the script uses an explicit glob (`node --test tests/unit/*.test.js`) instead, which passes reliably in this environment too.
- **Note (resolved):** Playwright's WebKit binary downloaded successfully in this environment (`npx playwright install webkit`); `npm run test:e2e` now runs both e2e specs against a real WebKit page and IndexedDB — 2/2 passing, including the Box 1 100% / Boxes 2-5 0% fill-percentage assertion at the DOM level.
- `manifest.webmanifest` ships an empty `icons` array — no icon asset exists yet in the repo; "Add to Home Screen" will use a default/blank icon until one is added (not blocking for this story's scope).

## Spec Change Log

## Review Triage Log

- **[defer]** `manifest.webmanifest` ships `icons: []` and `index.html` lacks `apple-touch-icon`/`apple-mobile-web-app-capable` meta tags. Evidence: verified — no icon asset file exists anywhere in the repo to reference; already flagged as non-blocking in Implementation Notes; requires a design asset outside this build's scope.
- **[defer]** `rr-fuel-tanks` has no ARIA role/label for assistive tech. Evidence: the Architecture Spine's own Deferred section explicitly defers "Accessibility specifics (contrast, focus order, screen-reader labeling)... worth a pass once components exist" — out of scope for this story by the architecture's own stated intent.
- **[low, rejected]** `rr-fuel-tanks.render()` replaces the entire `shadowRoot.innerHTML` on every update, foreclosing a future CSS-transition-based fill animation. Evidence: no animation requirement exists in this story's scope, no current caller re-renders after mount, and a patch-based DOM update is more than a direct correction — rejected per low-finding rule.
- **[false]** `store.js` could let `totalCards` diverge from summed `boxCounts` if a card had an out-of-range `box`. Evidence: verified — the only card producer in this diff (`card-generator.js`) always sets `box: 1`; no code path in the current diff ever creates or persists an out-of-range `box`, so the claimed divergence cannot occur today.
- **[low, patch]** `playwright.config.js`'s webkit project used `devices['Desktop Safari']` instead of an iPad profile. Evidence: Architecture Stack specifies "Playwright ... WebKit project only (matches Safari/iPadOS engine)"; fixed to use an iPad device profile.
- **[low, patch]** `.tanks` flex row had no wrap/overflow safeguard for larger Dynamic Type sizes. Evidence: NFR-4 requires layout to tolerate two steps up without truncating fuel-tank areas; container was unbounded and unwrapped; added `flex-wrap: wrap` + centering.
- **[low, patch]** `README.md` had no setup/test instructions for the new scaffold. Evidence: repo now ships a full dev/test stack (npm scripts, Playwright) undocumented; added a short Development section.
- **[low, patch]** `package.json` had no `engines.node` field. Evidence: Implementation Notes already document a Node-version-specific test-runner quirk (v24.9.0); pinned `engines.node` to prevent silent recurrence.
- **[low-medium, patch]** `src/db.js`'s `openDatabase()` had no `onblocked` handler. Evidence: verified — request only wired `onupgradeneeded`/`onsuccess`/`onerror`; a blocked open (e.g. a stale connection during a future `DB_VERSION` bump) would never resolve or reject, hanging `initDB()` silently; added a one-line handler.
- **[low, patch]** `src/main.js`'s `boot()` had no `.catch` on `store.init()`. Evidence: verified — a rejected `initDB()` (e.g. IndexedDB blocked/private-mode restriction) became an unhandled rejection with a blank Home screen and no diagnostic; added `.catch` + `console.error`.
- **[low, patch]** `card-generator.test.js` didn't cover addition/multiplication with a wider (non-1-1) range. Evidence: verified — existing tests only asserted wider ranges for subtraction/division; added direct test cases for addition/multiplication.
- **[low, patch]** `playwright.config.js`'s `webServer` command depended on `python3` being present. Evidence: dev-only tooling but fragile across environments; swapped to a small Node-based static server (Node is already a hard project requirement).
