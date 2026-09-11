# Epic 1 Context: Tiebe's Daily Rocket Run (Core Practice Loop)

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Tiebe can open the app, complete his full Daily Session across however many Runs are needed, watch his fuel tanks fill as he goes, retry misses without punishment, and always end in a Liftoff whose Flight Tier reflects his day - with a parent able to tell at a glance that today's Liftoff happened. This epic also establishes the project's structural seed and the Store-Mediated Web Components foundation (domain/store/db/components) with IndexedDB persistence and basic card generation at default (1-1) ranges. It is standalone: fully playable and testable without Epic 2 (parent settings).

## Stories

- Story 1.1: Project Foundation & Home with Empty Fuel Tanks
- Story 1.2: Due-Card Computation & Run Batching
- Story 1.3: Answer Input & Correct-First-Try Advancement
- Story 1.4: Retry-Until-Correct on a Miss (Capped)
- Story 1.5: Daily Liftoff with Flight Tiers
- Story 1.6: Parent-Visible Liftoff Status & Mid-Run Resume

## Requirements & Constraints

- Five fuel tanks (one per Leitner Box) show fill level proportional to cards held vs. total deck size; visuals update immediately on any card move; no numeric/percentage labels ever shown to Tiebe. Viewable from Home without starting a session.
- The full Due-card set (across all 5 boxes) is computed once at the start of each Daily Session; cards becoming newly due later that day wait until the next session.
- Due cards are presented in Runs of at most 20; sessions needing more than one Run continue automatically until exhausted, with a "Run X of Y" indicator shown only when more than one Run is needed (hidden on single-Run days).
- Exactly one Liftoff per day, triggered only after every Due Card across all Runs is complete - never at the end of an individual Run while cards remain.
- Answers are typed via numeric keypad; a single-digit correct answer shows direct number buttons instead. Only digits 0-9; an explicit submit action confirms the answer (no auto-submit, no drag-and-drop/swipe).
- Correct first attempt: card advances one Leitner Box, positive animation plays, and only the first attempt's correctness counts toward the day's Flight Tier.
- Incorrect attempt: retry the same card with no punishing feedback (no red, no buzzer, no score deduction); after 3 consecutive wrong attempts, reveal the correct answer and move on. Regardless of outcome, the card drops back to Box 1 that day (classic Leitner behavior).
- Liftoff shows one of three Flight Tiers by First-Attempt Accuracy: Perfect >=90%, Steady 60-89%, Gentle <60%. Tiers are visually distinct (color + star count) but never labeled with numbers/percentages/text.
- Parents must be able to tell whether today's Liftoff happened from the Home screen alone, not just during the animation, without a way to re-trigger it.
- Reopening the app mid-Run resumes exactly where Tiebe left off in today's Due-card set (never restarts).
- Platform constraints: client-only static site, no backend, iPadOS Safari/WebKit only, no shipped npm packages/frameworks under `src/` (standard Web Platform APIs only), no service worker/offline support (network required on load, home-screen install only).
- Accessibility/tone constraints: text sizing in `rem` honoring Dynamic Type (layout survives two steps up without truncating keypad/tanks); body text contrast >=4.5:1, Liftoff display type >=3:1; no red anywhere; no gray "disabled/failed" punishment styling; tap targets >=44pt (larger for the keypad); tier/success states distinguished by more than color alone; animations wrapped in `prefers-reduced-motion: reduce` and collapse instantly when set.
- Domain logic (Leitner transitions, card generation, retry cap, flight-tier calculation) must be pure, DOM-free, and unit-tested via `node:test`.

## Technical Decisions

- Architecture paradigm: Store-Mediated Web Components across four ES module layers with no backward dependency arrows - `domain/` (pure logic), `db.js` (sole IndexedDB owner), `store.js` (sole runtime-state owner, sole caller of `domain/`/`db.js`), `components/` (Custom Elements, Shadow DOM, render-only).
- Components communicate only via the Store: `CustomEvent` (`{bubbles:true, composed:true}`) flowing up, `render(state)` flowing down; event `detail` is always a flat object keyed `{ id, ...primitives }`.
- Small UI sub-elements (`rr-keypad`, `rr-run-progress`) render as internal Shadow DOM fragments within their parent screen component rather than separate Custom Elements, unless reused across screens.
- `db.js` exclusively owns the IndexedDB schema/migrations (one `onupgradeneeded` chain) and exposes typed CRUD consumed only by `store.js`.
- Naming conventions: custom element tags prefixed `rr-`; kebab-case filenames matching their tag/module; CustomEvent names lowercase with no dashes (e.g. `cardanswered`, `runcompleted`); Card id format `{operation}:{operandA}:{operandB}`; dates/timestamps as ISO 8601 strings; retry cap (3) and box count (5) are named constants in `src/domain/`, never magic numbers.
- Project structural seed (established in Story 1.1): `index.html`, `manifest.webmanifest`, `src/main.js`, `src/store.js`, `src/db.js`, `src/domain/{leitner.js, card-generator.js, tiers.js}`, `src/components/{rr-fuel-tanks.js, rr-run-view.js, rr-liftoff.js, rr-settings.js}`, `src/styles/base.css`, `tests/unit`, `tests/e2e`.
- Testing stack: `node:test` for domain unit tests; Playwright 1.63 WebKit-only project for e2e tests against real DOM + IndexedDB.
- Hosting: GitHub Pages (static, HTTPS by default). CI pipeline automation is deferred, not required for MVP.

## UX & Interaction Patterns

- Design-token system (colors, spacing scale 4/8/12/16/24/32/48px, radii `sm`/`md`/`lg`/`full`) is shared across all components; `base.css` must consume these tokens.
- `rr-fuel-tanks`: 5 rounded vertical vessels side by side, teal fill rising from the bottom, no numbers/labels; tap is view-only and never starts a session.
- `rr-keypad`: large square white keys with bold navy numerals and generous gaps; single-digit answers show a row of big direct-digit buttons instead; requires explicit submit.
- `rr-liftoff`: full-screen rocket-rising moment against the sky gradient; tier accent color plus star count (3/2/1) distinguishes tiers without relying on color alone; no score/percentage/text; plays exactly once per day.
- `rr-run-progress`: simple "Run X of Y" bar in rocket-orange inside `rr-run-view`, shown only on multi-Run days.
- Approved Dutch microcopy: retry prompt "Probeer het nog eens.", retry-cap reveal "Het antwoord is 7.", already-flown status "Vandaag al gevlogen! 🚀", multi-Run indicator "Nog een rondje te gaan." - never evaluative of Tiebe, no scorekeeping or error-toned wording.
- Information architecture: exactly 4 surfaces (Home, Run, Liftoff, Settings), single surface at a time, no tab bar.
- Home states to support: cold open already-flown (rocket at rest, no re-trigger); cold open not-yet-flown (rocket at launch pad, "start today's practice" primary action); fresh install at default 1-1 ranges (tanks render empty/flat, not broken, practice still startable).
- Run states to support: mid-Run resume; correct-first-try (positive animation, immediate tank update, no confirmation step); incorrect-before-cap (retry-sand surface, same card again, no red/buzzer/score change); retry-cap-exhausted (reveal answer, then advance); Run complete with more due remaining (brief transition, progress indicator persists).
- Banned anywhere in this epic's surfaces: timers, countdowns, buzzers, streak counters, leaderboards, score/point-deduction UI, red error states, swipe/drag gestures.

## Cross-Story Dependencies

- Story 1.1 establishes the structural seed, `db.js` schema, and base card generation that all later stories build on.
- Story 1.2's Due-card computation and Run batching depend on Story 1.1's domain/db foundation and feed the Run view used in Story 1.3.
- Story 1.4 (retry handling) extends the answer/advancement logic introduced in Story 1.3.
- Story 1.5's Flight Tier calculation depends on first-attempt results recorded during Stories 1.3 and 1.4.
- Story 1.6's parent-visible Liftoff status depends on Story 1.5's Liftoff trigger, and its mid-Run resume behavior depends on Story 1.2's Due-card/Run state.
- Epic 1 as a whole has no dependency on Epic 2; card generation in this epic runs at default (1-1) ranges only.
