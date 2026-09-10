---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories"]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-RekenRaketv2-2026-09-10/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-RekenRaketv2-2026-09-11/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-RekenRaketv2-2026-09-11/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-RekenRaketv2-2026-09-11/EXPERIENCE.md
---

# RekenRaket - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for RekenRaket, decomposing the requirements from the PRD, UX design contract (DESIGN.md + EXPERIENCE.md), and Architecture Spine into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: System displays 5 fuel tanks, one per Leitner Box, each showing a fill level proportional to the number of Cards currently held in that box, relative to the total deck size. Tank visuals update immediately after any Card moves between boxes; no numeric labels or percentages are rendered anywhere in the child-facing view.

FR-2: Tiebe can view current fuel-tank state from the app's home/start screen at any time, without starting a session.

FR-3: System determines the full set of Cards Due today, across all 5 Leitner Boxes, at the start of the Daily Session. The Due-card set is computed once at session start; Cards that become newly Due later the same day are not added until the next Daily Session.

FR-4: System presents Due Cards in Runs of at most 20 Cards each. If more than 20 Cards are Due, Tiebe completes multiple Runs until all Due Cards for the day are exhausted. Progress across Runs is preserved and visible via a "Run X of Y" indicator.

FR-5: System triggers exactly one Liftoff per day, only after every Due Card across all Runs has been completed. No liftoff/reward screen appears at the end of an individual Run while Due Cards remain in later Runs.

FR-6: Tiebe answers each Card by typing on a numeric keypad. If the correct answer is a single digit (0-9), the system shows direct number buttons instead of the full keypad. No drag-and-drop input in v1. Only digits 0-9 are available as input. An explicit submit action confirms an answer, rather than auto-submitting once a fixed digit count is reached. [ASSUMPTION]

FR-7: On a correct first attempt, the Card advances one Leitner Box. Positive visual/animation feedback plays. The Card's first-attempt result is recorded as correct for that day's Flight Tier calculation.

FR-8: On an incorrect attempt, the system prompts Tiebe to retry the same Card, without punishing feedback (no red X, no buzzer, no point/score deduction). After 3 [ASSUMPTION] consecutive wrong attempts on the same Card, the system moves on to the next Card in the Run regardless. The Card does not advance to the next box that day; instead it drops back to Box 1 per the classic Leitner method, whether answered correctly within the retry cap or moved on after exhausting it. Only the first attempt's correctness affects the day's Flight Tier. If the retry cap is exhausted without a correct answer, the system reveals the correct answer before moving on. Out of scope: any point, streak, or score deduction mechanic.

FR-9: Upon Daily Session completion, the system shows a Liftoff with one of three Flight Tiers - Perfect / Steady / Gentle Flight - set by First-Attempt Accuracy across all Cards played that day. A Liftoff always occurs on Daily Session completion; there is no "no liftoff"/failure state. Tier cutoffs (initial proposal): Perfect >= 90%, Steady 60-89%, Gentle < 60%. Tiers are visually distinct but unlabeled to Tiebe (no numbers/percentages shown).

FR-10: A parent can tell, at a glance, whether today's Liftoff has happened, without digging into a stats view. Liftoff status is visible on the app's home/start screen after completion (e.g. rocket at the launch pad vs. already flown), not only during the animation itself.

FR-11: A parent can independently enable or disable each of the four Operations (Addition, Subtraction, Multiplication, Division) for Card generation. Card generation excludes any disabled Operation entirely.

FR-12: A parent can independently set a Number Range (min/max operand bounds) for each enabled Operation. Card generation for an Operation only produces facts within its configured Number Range. Subtraction Cards are only generated where minuend >= subtrahend (non-negative results only); Division Cards are only generated where the divisor evenly divides the dividend (whole-number quotients only). Default Number Range for every Operation, before configured, is 1-1. Lowering a Number Range removes out-of-range Cards from their current boxes entirely (progress lost) and shows a warning popup before applying. Raising a Number Range adds new Cards starting in Box 1, no warning required. [ASSUMPTION: raising does not require the same warning as lowering]

FR-13: Configuration in FR-11/FR-12 lives in a settings area separate from Tiebe's play surface, a simple settings screen with no PIN-lock in v1.

### NonFunctional Requirements

NFR-1: The app is a single-child, client-only, static site (no backend), distributable informally to other families' iPads without app-store-scale packaging, installed via "Add to Home Screen." (PRD §6.1, Architecture scope)

NFR-2: Target runtime is iPadOS Safari/WebKit only (iPadOS 26). No shipped npm packages/frameworks - only standard Web Platform APIs (Custom Elements, Shadow DOM, ES modules, IndexedDB). (Architecture AD-3, Stack)

NFR-3: No service worker / true offline support in v1; the app requires network on load, installability limited to a home-screen icon. (Architecture AD-6)

NFR-4: Text sizing must use `rem` (never fixed `px`) so the OS Dynamic Type setting is honored; layout must tolerate at least two steps up from default without truncating the keypad or fuel-tank areas. (Architecture Consistency Conventions; DESIGN.md Typography)

NFR-5: Contrast targets: body text >= 4.5:1 against its surface; `display` type (Liftoff only) >= 3:1. No red, in any shade, anywhere in the product; no gray "disabled/failed" treatment that reads as punishment. (DESIGN.md Colors/Typography)

NFR-6: Any animation (e.g. Liftoff) must be wrapped in `@media (prefers-reduced-motion: reduce)`, collapsing to the end state instantly when set. (Architecture Consistency Conventions)

NFR-7: Domain logic (Leitner box transitions, card generation, retry-cap, flight-tier calculation) must be pure, DOM-free, and exercised directly by `node:test` unit tests. (Architecture AD-2)

### Additional Requirements

- Architecture paradigm: Store-Mediated Web Components - four ES module layers: `domain/` (pure logic), `db.js` (sole IndexedDB owner), `store.js` (sole runtime-state owner, sole caller of `domain/`/`db.js`), `components/` (Custom Elements, Shadow DOM, render-only). No backward dependency arrows. (AD-1, AD-2, AD-4, AD-5)
- No greenfield starter template specified by Architecture; project is built from a defined structural seed (index.html, manifest.webmanifest, src/main.js, src/store.js, src/db.js, src/domain/{leitner.js, card-generator.js, tiers.js}, src/components/{rr-fuel-tanks.js, rr-run-view.js, rr-liftoff.js, rr-settings.js}, src/styles/base.css, tests/unit, tests/e2e). Epic 1 Story 1 should establish this seed structure.
- Components communicate only through the Store via `CustomEvent` (`{bubbles:true, composed:true}`) up, `render(state)` down; event `detail` is always a flat object keyed `{ id, ...primitives }`. (AD-4)
- UI sub-elements (`rr-keypad`, `rr-run-progress`, `rr-settings-row`) render as internal Shadow DOM fragments within their single parent screen component, not separate Custom Elements, unless reused by more than one screen. (AD-7)
- IndexedDB schema/migrations owned exclusively by `db.js`, exposing typed CRUD consumed only by `store.js`. (AD-5)
- Naming conventions: custom element tags prefixed `rr-`; files kebab-case matching their tag/module; CustomEvent names lowercase, no dashes (e.g. `cardanswered`, `runcompleted`, `liftoffdismissed`); Card id format `{operation}:{operandA}:{operandB}`; dates/timestamps as ISO 8601 strings; retry cap (3) and box count (5) are named constants in `src/domain/`, not magic numbers.
- Hosting: GitHub Pages (static hosting, HTTPS by default).
- Testing stack: `node:test` for domain unit tests; Playwright 1.63 WebKit-only project for e2e tests against real DOM + IndexedDB.
- CI pipeline automation (e.g. GitHub Actions) is explicitly left open/deferred by Architecture - not required for MVP scope.

### UX Design Requirements

UX-DR1: Implement the DESIGN.md design-token system: color tokens (sky-day/sky-horizon gradient, space-navy, ink-secondary, panel-white, rocket-orange, fuel-teal, star-yellow/steady-blue/gentle-lilac tier accents, retry-sand, border-hairline), spacing scale (4/8/12/16/24/32/48px), and radii (`sm` 8px / `md` 16px / `lg` 24px / `full`) as reusable tokens consumed by all components.

UX-DR2: `rr-fuel-tanks` component: 5 tanks shown side by side, each a rounded vertical vessel (`rounded/lg`), teal fill rising from the bottom proportional to box contents, no numbers/percentage labels on or near it; tappable to view only, never starts a session by itself.

UX-DR3: `rr-keypad` component: large square `panel-white` keys with bold navy numerals and generous gaps to prevent mis-taps for the full multi-digit keypad; replaced by a row of big direct-digit buttons when the answer is a single digit (0-9); requires an explicit submit action to confirm an answer.

UX-DR4: `rr-liftoff` component: full-screen moment, rocket silhouette rising against the sky gradient, accent color set by the day's Flight Tier (star-yellow/steady-blue/gentle-lilac), tiers additionally distinguished by star count in the sky (3 Perfect / 2 Steady / 1 Gentle) so the distinction never rests on color alone; no score, percentage, or text label rendered anywhere; plays exactly once per day.

UX-DR5: `rr-run-progress` component: a simple "Run X of Y" bar in `rocket-orange`, rendered inside `rr-run-view`, shown only when a Daily Session needs more than one Run - hidden entirely on a single-Run day.

UX-DR6: `rr-settings-row` component: label/value/chevron pattern with hairline dividers, denser spacing than the play surface, rendered (repeated) inside `rr-settings`; per-Operation toggle + Number Range fields; a lowering-range change triggers a confirmation popup naming the progress loss, a raising-range change applies immediately without confirmation.

UX-DR7: Dutch-language microcopy per the EXPERIENCE.md Voice and Tone table - specific approved phrases for the retry prompt ("Probeer het nog eens."), the retry-cap reveal ("Het antwoord is 7."), Liftoff-already-flown status ("Vandaag al gevlogen! 🚀"), the multi-Run indicator ("Nog een rondje te gaan."), and plain/neutral adult-register Settings copy (e.g. "Aftrekken: van 1 tot 10"); never evaluative of Tiebe, never scorekeeping framing, no red/error wording ("Fout!", "Helaas!").

UX-DR8: Information architecture: exactly 4 surfaces (Home, Run, Liftoff, Settings), no tab bar, single-surface-at-a-time (never shown together), each reached by one obvious action; Settings reached via a small, low-prominence affordance on Home (e.g. corner gear icon) that doesn't compete with the play surface.

UX-DR9: Home-surface states: cold open with Liftoff already flown today (rocket at rest / "already flown" pose, no way to re-trigger); cold open with Liftoff not yet flown (rocket at launch pad, primary affordance "start today's practice"); fresh install with every Operation still at default 1-1 range (fuel tanks render empty/flat, not broken/errored, primary affordance still available).

UX-DR10: Run-surface states: mid-Run resume (reopens exactly where Tiebe left off within today's Due-card set, never restarts); correct-first-try (positive animation, tank fill updates, immediate advance, no confirmation step); incorrect attempt before cap (retry-sand surface, "Probeer het nog eens," same Card again, no red/buzzer/score change); retry-cap exhausted (reveal correct answer plainly, then advance); Run complete with more Due Cards remaining (brief transition, "Run X of Y" stays visible).

UX-DR11: Settings-surface states: lowering a Number Range shows a confirmation popup naming the progress that will be lost before applying; raising a Number Range applies immediately with no confirmation.

UX-DR12: Accessibility floor: Flight Tiers and retry/success states distinguished by more than color alone (shape/animation in addition to color); tap targets sized for a young child's motor control (at least the standard 44pt iOS minimum, larger for the keypad specifically); body text legible at a young-independent-reader size by default, not dependent on a system accessibility setting to reach baseline legibility; Liftoff animation degrades gracefully under `prefers-reduced-motion` to a simple end-state rather than blocking.

UX-DR13: Interaction primitives: tap-to-advance everywhere, no swipe/drag gestures anywhere in v1; type/tap digits then an explicit submit action; banned UI elements anywhere in the product - timers, countdowns, buzzers, streak counters, leaderboards, any score/point-deduction UI, red error states.

### FR Coverage Map

FR-1: Epic 1 - Fuel tank display
FR-2: Epic 1 - Fuel tank view outside session
FR-3: Epic 1 - Due-card computation
FR-4: Epic 1 - Batching into Runs
FR-5: Epic 1 - Single daily Liftoff
FR-6: Epic 1 - Answer input (keypad/direct-digit)
FR-7: Epic 1 - Correct-first-try advancement
FR-8: Epic 1 - Retry-until-correct, capped
FR-9: Epic 1 - Liftoff with Flight Tier
FR-10: Epic 1 - Parent-visible Liftoff status
FR-11: Epic 2 - Per-operation enable/disable
FR-12: Epic 2 - Per-operation Number Range
FR-13: Epic 2 - Parent-facing settings surface

## Epic List

### Epic 1: Tiebe's Daily Rocket Run (Core Practice Loop)
Tiebe can open the app, complete his full Daily Session across however many Runs are needed, see his fuel tanks fill as he goes, retry misses without punishment, and always end in a Liftoff whose Flight Tier reflects his day - with a parent able to tell at a glance that today's Liftoff happened. Includes the project's structural seed (Architecture), the Store-Mediated Web Components foundation (domain/store/db/components), IndexedDB persistence, and basic card generation at default (1-1) ranges. Standalone: fully playable and testable without Epic 2.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-10

### Epic 2: Parent Configures the Math Content
A parent can independently enable/disable each Operation (Addition, Subtraction, Multiplication, Division) and set its Number Range, safely and separately from Tiebe's play surface, with a warning before a change would cost progress.
**FRs covered:** FR-11, FR-12, FR-13

## Epic 1: Tiebe's Daily Rocket Run (Core Practice Loop)

Tiebe can open the app, complete his full Daily Session across however many Runs are needed, see his fuel tanks fill as he goes, retry misses without punishment, and always end in a Liftoff whose Flight Tier reflects his day - with a parent able to tell at a glance that today's Liftoff happened. Includes the project's structural seed (Architecture), the Store-Mediated Web Components foundation (domain/store/db/components), IndexedDB persistence, and basic card generation at default (1-1) ranges. Standalone: fully playable and testable without Epic 2.

### Story 1.1: Project Foundation & Home with Empty Fuel Tanks

As Tiebe,
I want to open the app and see my fuel-tank status on the Home screen,
So that I always have a starting point before practicing.

**Acceptance Criteria:**

**Given** a fresh checkout
**When** the project is built
**Then** the structural seed exists exactly as defined in the Architecture Spine (index.html, manifest.webmanifest, src/main.js, src/store.js, src/db.js, src/domain/{leitner.js, card-generator.js, tiers.js}, src/components/{rr-fuel-tanks.js, rr-run-view.js, rr-liftoff.js, rr-settings.js}, src/styles/base.css, tests/unit, tests/e2e)

**Given** the app is loaded
**When** it runs
**Then** it is a static, client-only site (no backend, no npm packages shipped under `src/`, ES modules only, iPadOS Safari target)

**Given** `db.js`
**When** the app first opens
**Then** it is the sole owner of an IndexedDB schema covering the 5 Leitner Boxes and Cards, with one `onupgradeneeded` migration chain

**Given** `domain/card-generator.js`
**When** invoked with default settings (all 4 Operations, Number Range 1-1)
**Then** it produces Cards as pure, DOM-free logic, all initially placed in Box 1, and is exercised by `node:test` unit tests

**Given** the Home screen
**When** rendered
**Then** `rr-fuel-tanks` shows 5 tanks side by side, each filled proportional to its box's card count, with no numeric or percentage labels

**Given** the Home screen
**When** viewed
**Then** the fuel-tank state is visible without starting a Daily Session (FR-2)

**Given** `base.css`
**When** styling is applied
**Then** it uses the DESIGN.md token set (colors, spacing, radii) and `rem`-based text sizing, with no red anywhere in the UI

### Story 1.2: Due-Card Computation & Run Batching

As Tiebe,
I want the app to gather everything due today and split it into manageable Runs,
So that I never face an overwhelming pile at once.

**Acceptance Criteria:**

**Given** the start of a Daily Session
**When** it begins
**Then** the system computes the full Due-card set once, across all 5 Boxes (FR-3)

**Given** the Due-card set is already computed for today
**When** a Card becomes newly due later the same day
**Then** it is not added until the next Daily Session (FR-3)

**Given** more than 20 Cards are Due
**When** a Run of 20 completes
**Then** the next Run starts automatically, continuing until all Due Cards are exhausted (FR-4)

**Given** a Daily Session needs more than one Run
**When** a Run is in progress
**Then** a "Run X of Y" indicator (`rr-run-progress`, rocket-orange fill) is shown (FR-4, UX-DR5)

**Given** a Daily Session needs only one Run
**When** playing
**Then** the run-progress indicator is hidden entirely (UX-DR5)

**Given** a fresh install at default 1-1 ranges
**When** practice starts
**Then** the (near-trivial) Due-card set still runs without error (UX-DR9)

### Story 1.3: Answer Input & Correct-First-Try Advancement

As Tiebe,
I want to type my answer and see it recognized right away,
So that solving each card feels immediate and rewarding.

**Acceptance Criteria:**

**Given** a Card whose correct answer has 2+ digits
**When** the Run view renders it
**Then** a full numeric keypad (`rr-keypad`) is shown (FR-6)

**Given** a Card whose correct answer is a single digit (0-9)
**When** rendered
**Then** direct-digit buttons replace the full keypad (FR-6)

**Given** digits entered on the keypad
**When** the explicit submit action has not been pressed
**Then** the answer is not yet evaluated (FR-6, UX-DR13)

**Given** a correct answer submitted on the first attempt
**When** evaluated
**Then** the Card advances one Leitner Box, a positive animation plays, and the result is recorded as correct for the day's Flight Tier calculation (FR-7)

**Given** the keypad
**When** interacted with
**Then** only tap input is supported - no drag-and-drop or swipe gestures (UX-DR13)

**Given** the keypad's visual spec
**When** styled
**Then** keys use `panel-white` surfaces, `rounded/md`, generous gaps, and tap targets at least the 44pt minimum (larger for the keypad specifically) (UX-DR3, UX-DR12)

**Given** `domain/leitner.js` box-advancement logic
**When** exercised
**Then** it is pure, DOM-free, and covered by `node:test` (NFR-7)

### Story 1.4: Retry-Until-Correct on a Miss (Capped)

As Tiebe,
I want a wrong answer to just mean "try again,"
So that mistakes never feel like punishment.

**Acceptance Criteria:**

**Given** an incorrect attempt on a Card
**When** evaluated
**Then** the retry-sand surface appears with "Probeer het nog eens." and the same Card is presented again - no red, no buzzer, no score change (FR-8, UX-DR7, NFR-5)

**Given** 3 consecutive wrong attempts on the same Card
**When** a 4th attempt would otherwise be required
**Then** the system reveals the correct answer plainly instead and advances to the next Card (FR-8)

**Given** a Card was answered within the retry cap or moved on after exhausting it
**When** that day ends
**Then** the Card drops back to Box 1 regardless (FR-8)

**Given** retries on a Card
**When** the day's Flight Tier is calculated
**Then** only the first attempt's correctness counts - retries and reaching the cap have no further effect (FR-8)

**Given** the retry cap (3) and box count (5)
**When** referenced in code
**Then** they exist as named constants in `src/domain/`, not magic numbers

### Story 1.5: Daily Liftoff with Flight Tiers

As Tiebe,
I want every finished practice day to end with my rocket lifting off,
So that today always counts.

**Acceptance Criteria:**

**Given** all Due Cards across all Runs are completed
**When** the last Run finishes
**Then** exactly one Liftoff triggers automatically (FR-5, FR-9)

**Given** Due Cards remain in a later Run
**When** an individual Run completes
**Then** no liftoff/reward screen appears yet (FR-5)

**Given** the day's First-Attempt Accuracy
**When** Liftoff triggers
**Then** `domain/tiers.js` (pure, `node:test`-covered) determines one of three Flight Tiers - Perfect (>=90%), Steady (60-89%), Gentle (<60%) (FR-9, NFR-7)

**Given** a Flight Tier
**When** `rr-liftoff` renders
**Then** it shows a tier-specific accent color (star-yellow/steady-blue/gentle-lilac) AND a distinct star count (3/2/1), with no score, percentage, or text label anywhere (FR-9, UX-DR4, UX-DR12)

**Given** the Liftoff animation
**When** `prefers-reduced-motion: reduce` is set
**Then** it collapses instantly to the end state instead of animating (NFR-6)

### Story 1.6: Parent-Visible Liftoff Status & Mid-Run Resume

As a parent,
I want to tell at a glance whether today's practice happened,
So that I can grant TV time without negotiation.

**Acceptance Criteria:**

**Given** today's Liftoff already happened
**When** Home renders
**Then** it shows the rocket in an "already flown" pose with copy "Vandaag al gevlogen! 🚀", with no way to re-trigger today's Liftoff (FR-10, UX-DR7, UX-DR9)

**Given** today's Liftoff has not yet happened
**When** Home renders
**Then** it shows the rocket at the launch pad with "start today's practice" as the primary affordance (UX-DR9)

**Given** the app was closed mid-Run
**When** Tiebe reopens it the same day
**Then** the session resumes exactly where he left off within today's Due-card set, rather than restarting (UX-DR10)

**Given** Liftoff status
**When** checked at any time after completion
**Then** it is visible on Home, not only during the animation itself (FR-10)

## Epic 2: Parent Configures the Math Content

A parent can independently enable/disable each Operation (Addition, Subtraction, Multiplication, Division) and set its Number Range, safely and separately from Tiebe's play surface, with a warning before a change would cost progress.

### Story 2.1: Settings Screen & Per-Operation Enable/Disable

As a parent,
I want to reach a settings screen separate from Tiebe's play surface and turn each math Operation on or off,
So that I control what he practices without disrupting his play.

**Acceptance Criteria:**

**Given** the Home screen
**When** viewed
**Then** a small, low-prominence affordance (e.g. corner gear icon) leads to Settings, distinct from Tiebe's play surface (FR-13, UX-DR8)

**Given** Settings
**When** opened
**Then** no PIN-lock is required (FR-13)

**Given** Settings
**When** rendered
**Then** each of the four Operations (Addition, Subtraction, Multiplication, Division) is shown via `rr-settings-row` with an independent enable/disable toggle, label/value/chevron pattern, and hairline dividers (FR-11, UX-DR6)

**Given** an Operation is disabled
**When** Card generation runs
**Then** no Cards are created or presented for that Operation (FR-11)

**Given** Settings copy
**When** displayed
**Then** it uses plain, neutral, adult-register Dutch (e.g. "Aftrekken: van 1 tot 10"), never Tiebe's playful register (UX-DR7)

### Story 2.2: Per-Operation Number Range Configuration

As a parent,
I want to set the number range for each operation and be warned before a change would erase progress,
So that I can safely tune the difficulty as Tiebe improves.

**Acceptance Criteria:**

**Given** an enabled Operation
**When** a parent sets its Number Range (min/max)
**Then** Card generation for that Operation only produces facts within the configured range (FR-12)

**Given** Subtraction
**When** Cards are generated
**Then** only facts where minuend >= subtrahend are produced (non-negative results only) (FR-12)

**Given** Division
**When** Cards are generated
**Then** only facts where the divisor evenly divides the dividend are produced (whole-number quotients only) (FR-12)

**Given** an Operation not yet configured
**When** the app is first installed
**Then** its default Number Range is 1-1 (FR-12)

**Given** a parent raises an Operation's Number Range
**When** applied
**Then** it takes effect immediately with no confirmation, and new Cards for newly-included facts start in Box 1 (FR-12, UX-DR11)

**Given** a parent lowers an Operation's Number Range
**When** they attempt to apply it
**Then** a warning popup appears first, naming that Cards outside the new range (and their progress) will be lost (FR-12, UX-DR11)

**Given** the warning popup is confirmed
**When** the lowered range is applied
**Then** Cards whose facts fall outside the new range are removed from their current boxes entirely (FR-12)
