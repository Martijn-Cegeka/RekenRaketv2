---
title: 'Due-Card Computation & Run Batching'
type: 'feature'
created: '2026-09-11'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
context: []
baseline_commit: '06357c7b2abfa15a90a80e225ebf4f1ca0bd58e5'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Tiebe has no way to start a Daily Session yet — `rr-run-view` is an empty stub, and there is no logic to determine which cards are due today or to split them into manageable batches.

**Approach:** Add a pure domain module that snapshots the full deck as the day's Due-card set and splits it into Runs of at most 20; wire `store.js` to hold in-memory session/run state (`startSession`, `completeCurrentRun`); add a minimal "start today's practice" trigger in `main.js` that starts the session and switches the visible surface to `rr-run-view`, which renders the "Run X of Y" indicator (only when >1 run) and the current run's card count. No answer input or box advancement (Story 1.3).

## Boundaries & Constraints

**Always:** Due-card set = a snapshot of every card currently in the deck, computed once when the session starts; it does not change even if the underlying deck changes mid-session (no live re-query). Runs split the due set into consecutive chunks of at most 20 cards, in deck order. `RUN_SIZE` is a named constant in `src/domain/`. Session/run state lives only in `store.js` (in-memory) — no IndexedDB schema change. Domain functions stay pure and DOM-free, unit-tested via `node:test`. Follow AD-1..AD-5 (only `store.js` calls `domain/`/`db.js`; components stay render-only).

**Never:** No answer input, keypad, or Leitner box advancement (Story 1.3). No Liftoff trigger (Story 1.5). No persistence of session/run state to `db.js` for reload-resume (Story 1.6 owns mid-Run resume). No `dueAt`/per-box interval scheduling — every card in the deck is due every day per FR-3.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fresh install (4 cards, default 1-1 ranges) | `startSession()` called | 1 run of 4 cards; `runs.length === 1` | Runs without error (UX-DR9) |
| Exactly 20 due cards | 20 cards in deck | 1 run of 20 | N/A |
| 21 due cards | 21 cards in deck | 2 runs: `[20, 1]` | N/A |
| Mid-session deck change | Session started, then a card is added to the deck | Session's due set is unaffected until next `startSession()` call | N/A |
| Completing the last run | `completeCurrentRun()` called when `currentRunIndex === runs.length - 1` | `session.isComplete` becomes `true`; index does not advance past `runs.length` | N/A |
| Single-run session | 1 run total | `rr-run-view` renders without a "Run X of Y" indicator | N/A |
| Multi-run session | >1 run total | `rr-run-view` renders "Run X of Y" (`rr-run-progress`, rocket-orange) | N/A |

</frozen-after-approval>

## Code Map

- `src/domain/session.js` -- new; pure, exports `RUN_SIZE = 20`, `getDueCards(allCards)` (returns a shallow-copied snapshot array), `batchIntoRuns(dueCards, runSize = RUN_SIZE)` (splits into arrays of length ≤ `runSize`, preserving order).
- `src/store.js` -- extend `createStore()`: add `session` to state (`null` until started); `startSession()` reads cards via existing `getAllCards(db)`, calls `getDueCards`/`batchIntoRuns`, sets `state.session = { runs, currentRunIndex: 0, isComplete: false }`, notifies subscribers; `completeCurrentRun()` increments `currentRunIndex` (clamped to `runs.length`), sets `isComplete` when exhausted, notifies subscribers.
- `src/components/rr-run-view.js` -- implement `render(state)` per the `rr-fuel-tanks.js` Shadow DOM pattern: hidden/no-op when `state.session` is `null`; otherwise renders current run's card count and, only when `state.session.runs.length > 1`, a `rocket-orange` "Run X of Y" fragment (`rr-run-progress`, inline Shadow DOM fragment per AD-7, not a separate Custom Element).
- `src/main.js` -- add a plain "start today's practice" button (outside any Shadow DOM, app-shell level) that calls `store.startSession()` on click, then toggles visibility (hide fuel-tanks+button, show `rr-run-view`) via the existing `subscribe` mechanism when `state.session` is non-null.
- `tests/unit/session.test.js` -- new; covers the I/O matrix's `getDueCards`/`batchIntoRuns` scenarios (fresh install, exactly 20, 21-card split).
- `tests/unit/store.test.js` -- extend; covers `startSession`/`completeCurrentRun` state transitions, including the completing-last-run case.

## Tasks & Acceptance

**Execution:**
- [x] `src/domain/session.js` -- implement `RUN_SIZE`, `getDueCards`, `batchIntoRuns` -- FR-3, FR-4 groundwork
- [x] `src/store.js` -- add `session` state, `startSession()`, `completeCurrentRun()` -- FR-3, FR-4
- [x] `src/components/rr-run-view.js` -- implement `render(state)` with conditional Run X of Y indicator -- FR-4, UX-DR5
- [x] `src/main.js` -- wire start-practice trigger + view switching -- makes the session reachable end-to-end
- [x] `tests/unit/session.test.js` -- cover I/O matrix -- NFR-7 (domain testability)
- [x] `tests/unit/store.test.js` -- cover session/run transitions -- NFR-7
- [x] `tests/e2e/home.spec.js` or new e2e spec -- extend/add: starting practice on a fresh (4-card) deck shows `rr-run-view` with no "Run X of Y" indicator -- confirms end-to-end wiring for UX-DR9

**Acceptance Criteria:**
- Given the start of a Daily Session, when it begins, then the full Due-card set is computed once, across all boxes.
- Given the Due-card set is computed, when more cards would exist later that day, then the session's due set does not change until the next session.
- Given more than 20 Cards are Due, when a Run of 20 completes, then the next Run starts automatically until all Due Cards are exhausted.
- Given a Daily Session needs more than one Run, then "Run X of Y" is shown; given it needs only one Run, then it is hidden entirely.
- Given a fresh install at default 1-1 ranges, when practice starts, then the session runs without error.

### Review Findings

- [x] [Review][Defer] Numeric run count + English UI copy violate DESIGN.md/EXPERIENCE.md — DESIGN.md's Brand & Style anti-pattern table forbids "numbers, percentages, or scoreboards anywhere in Tiebe's view," but `rr-run-view.js` renders a raw `.run-card-count` integer. EXPERIENCE.md requires "UI language is Dutch throughout" and its own approved microcopy table specifies a static Dutch phrase ("Nog een rondje te gaan.") for the multi-Run indicator — not a numeric "X of Y" counter — while `epic-1-context.md` (loaded as this story's primary planning context) states the same approved copy. The shipped code instead renders English `Run ${n} of ${total}` and an English `"Start today's practice"` button label. [src/components/rr-run-view.js](../../../src/components/rr-run-view.js), [src/main.js](../../../src/main.js) — deferred: was wrongly specced
- [x] [Review][Patch] e2e test title overstates its own coverage [tests/e2e/home.spec.js:49] — title claims "...and hides it once each run completes in range" but the test body never calls/triggers run completion; only the initial multi-run render is asserted. Fixed: title shortened to match what's actually asserted.
- [x] [Review][Defer] Session completion (`isComplete`) has no UI transition [src/components/rr-run-view.js, src/main.js] — deferred: out of scope until Story 1.5 (Liftoff) per this spec's own "Never" boundary; interim stuck state is an accepted consequence of building this story in isolation.
- [x] [Review][Defer] No accessibility affordances (aria-live/focus management) for the Home→Run transition [src/components/rr-run-view.js, src/main.js] — deferred: consistent with Story 1.1's own precedent of deferring accessibility specifics; not yet tracked in deferred-work.md.
- [x] [Review][Defer] `:host([hidden])` CSS fix not yet applied to `rr-liftoff`/`rr-settings` [src/components/rr-liftoff.js, src/components/rr-settings.js] — deferred: those components have no `:host` style yet (pre-existing stubs), so no override exists to break `hidden` today; only tracked in agent memory, not this repo's tracked backlog.

**Rejected:**
- `false` — `rr-run-view` renders with stale default state before a session starts: refuted — `connectedCallback()` calls `render(this._state)` on mount, correctly rendering the empty (`session: null`) state immediately.
- `false` — `batchIntoRuns(runSize <= 0)` could infinite-loop: refuted — the only call site (`store.js`'s `startSession()`) always uses the default `RUN_SIZE = 20` constant; no path passes a caller-supplied `runSize`.
- `low` — e2e test hardcodes IndexedDB literals (`'rekenraket'`, version `1`, `'cards'`) instead of importing constants from `db.js`: not worth fixing — `db.js` doesn't currently export those constants, so the fix adds new public surface, and the values are architecturally stable.
- `low` — `rr-run-view.js`/`main.js` view-switching logic have no fast unit/DOM-level test, only e2e: not worth fixing — consistent with this repo's established precedent (`rr-fuel-tanks` is likewise only e2e-tested; no DOM-testing library is present for `node:test`).
- `low` — double-clicking `#start-practice` could race two concurrent `startSession()` calls: carried from the implementation-time review — both calls settle to the same result given an unchanged deck; a proper guard is more than a direct fix.

## Implementation Notes

- `getDueCards`/`batchIntoRuns` in `src/domain/session.js` are pure and unit-tested for the fresh-install (4), exactly-20, and 21-card (`[20, 1]`) matrix cases, plus the shallow-copy snapshot guarantee.
- `store.js`'s `session` state is plain in-memory (`{ runs, currentRunIndex, isComplete }`), set only by `startSession()`/`completeCurrentRun()`; `completeCurrentRun()` clamps `currentRunIndex` to `runs.length` and derives `isComplete` from that clamp, matching the "completing the last run" edge case.
- `rr-run-view` renders `.run-card-count` always, and a `.rr-run-progress` (rocket-orange) fragment only when `runs.length > 1`; it is a no-op (empty shadow root) when `state.session` is `null`.
- `main.js` adds a plain `#start-practice` button at the app-shell level (outside any Shadow DOM) that calls `store.startSession()`; the existing `subscribe` mechanism toggles `hidden` on fuel-tanks/button vs. `rr-run-view` based on `state.session`.
- **Bug found and fixed in review:** `rr-fuel-tanks`/`rr-run-view`'s Shadow DOM styles set `:host { display: block; }` unconditionally (author-origin, no `!important`), which in this WebKit build overrides the native `hidden` attribute's UA-stylesheet rule — so `element.hidden = true` silently failed to hide either component. Added `:host([hidden]) { display: none; }` to both. Caught by the new e2e test (`rr-fuel-tanks` stayed visible after starting a session).
- `db.js`'s `putCards` is now exported (was internal) so tests can seed extra cards directly, matching the existing `initDB`/`getAllCards` direct-test pattern in `db.test.js`.
- Matrix Test Audit: added two store-level tests to close coverage gaps — "startSession batches more than 20 due cards into multiple runs" (Multi-run session row) and "session snapshot is unaffected by cards added after startSession" (Mid-session deck change row).
- Verified via `node --test tests/unit/*.test.js` (23/23 passing) and `npx playwright test` (4/4 passing, WebKit was already cached in this environment — the earlier "no network egress" repo note does not apply here).

## Spec Change Log

## Review Triage Log

- **[medium, patch]** `rr-run-view.render()`'s "Run X of Y" fragment used `runs.length > 1` alone as its guard, so once `currentRunIndex` reaches `runs.length` (session complete), it rendered an out-of-range label like "Run 3 of 2"; the multi-run render path also had zero test coverage anywhere in the diff. Evidence: verified — three reviewers independently traced the same out-of-range read and confirmed no test (unit or e2e) exercised `runs.length > 1` rendering. Fixed by adding `&& currentRunIndex < runs.length` to the guard; added a unit test (`completeCurrentRun clamps currentRunIndex at runs.length after the last of several runs completes`) and an e2e test (`Starting practice with more than 20 due cards shows "Run 1 of 2"...`) covering the previously-untested multi-run render path.
- **[low, patch]** `main.js`'s `#start-practice` click handler had no `.catch` on `store.startSession()`, inconsistent with the existing `store.init()` error-handling precedent in the same file. Evidence: verified — no catch was present; a rejected `startSession()` (e.g. IndexedDB failure) would become an unhandled rejection with no user feedback. Added `.catch(console.error)` matching the established pattern.
- **[low, rejected]** Double-clicking `#start-practice` before the button hides could trigger two concurrent `startSession()` calls. Evidence: verified reachable, but both calls read the same unchanged deck and the last write settles to the same result — no real corruption in practice, and a proper guard (disabling the button, tracking in-flight state) is more than a direct correction.
- **[false]** `startSession()` could be invoked while `db` is still `null` (before `init()` resolves). Evidence: verified — `main.js` only attaches the `#start-practice` click listener after `await store.init()` resolves, so this precondition is unreachable through the actual UI wiring in this diff.
- **[false]** `batchIntoRuns([])`/`completeCurrentRun()` on a zero-card deck immediately reports `isComplete: true`. Evidence: verified — `db.js` always seeds a non-empty default deck and has no deletion path, so a zero-card deck is unreachable anywhere in the current app; would need revisiting if Epic 2 ever allows an empty deck.
- **[false]** The `:host([hidden])` CSS fix (see Implementation Notes) was applied only to `rr-fuel-tanks`/`rr-run-view`, not `rr-liftoff`/`rr-settings`. Evidence: verified — those two components are still empty stubs with no `:host` style at all, so no override exists yet to break their `hidden` attribute; noted in repo memory for when their own stories implement `render()`.
- **[rejected]** Spec's `## Review Triage Log` section was empty despite Implementation Notes describing a bug found during implementation. Evidence: fix would be to edit this spec document itself — out of scope per triage rules.
- **[false]** `startSession()` re-reads the full deck via `getAllCards(db)` instead of reusing the `state` already loaded by `init()`. Evidence: verified — this is an intentional fresh read to guarantee the snapshot reflects the deck at session-start time; no incorrect behavior results, and the re-fetch is cheap (fake/real IndexedDB `getAll()` on a small store).
