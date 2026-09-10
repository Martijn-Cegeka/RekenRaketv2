---
name: RekenRaket
status: final
sources:
  - "{planning_artifacts}/briefs/brief-RekenRaketv2-2026-09-10/brief.md"
  - "{planning_artifacts}/prds/prd-RekenRaketv2-2026-09-10/prd.md"
  - "{planning_artifacts}/architecture/architecture-RekenRaketv2-2026-09-11/ARCHITECTURE-SPINE.md"
created: '2026-09-11'
updated: '2026-09-11'
---

# RekenRaket — Experience Spine

> Fast-path draft: batched from the Brief, PRD, and Architecture Spine without a full coaching-path Discovery pass. `[ASSUMPTION]` tags mark calls not explicit in those sources. Paired with `DESIGN.md` (RekenRaket). Hobby-stakes, single-family v1.

## Foundation

Single-surface iPad web app — a client-only, static PWA-style site installed via "Add to Home Screen" (per Architecture Spine: no service worker, no true offline in v1; requires network on load). No UI system named — vanilla Custom Elements / Shadow DOM (Store-Mediated Web Components). `DESIGN.md` is the visual identity reference; this spine owns behavior only. UI language is Dutch throughout, including parent-facing Settings.

There is no login and no multi-child profile — one install, one child, no account switching to design for.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Home / Start | App open (cold) | Fuel-tank state (all 5 boxes) at a glance; Liftoff status for today (flown / not yet); entry point into today's Run |
| Run (session) | Home → start practice | Presents Due Cards in batches of ≤20; the numeric keypad / direct-digit input; retry-until-correct on a miss |
| Liftoff | Automatic, on Daily Session completion | The one-per-day climax; Flight Tier reveal (Perfect / Steady / Gentle) |
| Settings | Home (parent-only entry point) | Per-operation enable/disable + Number Range configuration; no PIN-lock in v1 |

No tab bar needed — four surfaces, each reached by a single, obvious action, no lateral navigation between Run/Liftoff/Settings. `[ASSUMPTION]` Settings is reached via a small, deliberately low-prominence affordance on Home (e.g. a corner gear icon) so it doesn't compete with Tiebe's play surface — exact placement is a layout-pass decision, not fixed here.

→ Composition reference: `mockups/key-home.html`, `mockups/key-run.html`, `mockups/key-liftoff.html`, `mockups/key-settings.html`. Spine wins on conflict.

## Voice and Tone

Microcopy, in Dutch. Brand voice and aesthetic posture live in `DESIGN.md.Brand & Style`. Tiebe-facing copy is short, concrete, and never evaluative of him as a person — only ever about the card or the day. Parent-facing (Settings) copy is plain and neutral, adult register.

| Do | Don't |
|---|---|
| "Probeer het nog eens." (retry prompt) | "Fout!" / "Helaas!" |
| "Het antwoord is 7." (reveal after retry cap) | "Fout antwoord: 7" or any scorekeeping framing |
| "Vandaag al gevlogen! 🚀" (Home, Liftoff already happened) | A streak count, a percentage, or "Dag 14 op rij" |
| "Nog een rondje te gaan." (multi-Run indicator) | "Level 2 van 3" (game-score framing) |
| Settings: "Aftrekken: van 1 tot 10" (plain, factual) | Playful/childish tone in the parent surface |

`[ASSUMPTION]` Exact Liftoff-moment copy per Flight Tier (Perfect / Steady / Gentle) is not yet drafted — flagged as an open item for the next pass; the constraint above (no labels, no scores, always warm) should govern it.

## Component Patterns

Behavioral. Visual specs live in `DESIGN.md.Components`.

| Component | Use | Behavioral rules |
|---|---|---|
| Fuel tanks (`rr-fuel-tanks`) | Home | 5 tanks, one per Leitner Box; fill updates immediately after any Card moves box. Tappable to view only — never starts a session by itself (FR-2). |
| Keypad / direct-digit buttons (`rr-keypad`) | Run | Full keypad for multi-digit answers; direct-digit row when the answer is 0–9. `[ASSUMPTION]` explicit submit action (e.g. an Enter/check key) confirms an answer — no auto-submit on digit-count match (per PRD FR-6 assumption). |
| Run progress (`rr-run-progress`) | Run | Shown only when a Daily Session needs >1 Run (FR-4); hidden entirely on a single-Run day so it never adds visual noise to the common case. |
| Liftoff (`rr-liftoff`) | Liftoff | Plays exactly once per day, only after every Run is done (FR-5, FR-9). Always ends in a launch — no failure state exists to design for. Tier told apart by star count (3/2/1), not text (see `DESIGN.md.Components`). |
| Settings row (`rr-settings-row`) | Settings | Per-Operation toggle + Number Range fields (FR-11, FR-12). Lowering a range triggers a confirmation popup (progress-loss warning); raising one does not (per PRD assumption). |

## State Patterns

| State | Surface | Treatment |
|---|---|---|
| Cold open, Liftoff already flown today | Home | Rocket shown at rest / "already flown" pose; fuel tanks reflect current state; no way to re-trigger today's Liftoff. |
| Cold open, Liftoff not yet flown | Home | Rocket at the launch pad; primary affordance is "start today's practice." |
| Cold open, nothing configured yet (fresh install, every Operation still at its default 1–1 range) | Home | Fuel tanks render empty/flat rather than broken; primary affordance still "start today's practice" — with near-trivial Due Cards until a parent configures a real Number Range (FR-12). No error state; this is a valid, if uninteresting, first day. |
| Mid-Run resume | Run | Reopening the app mid-session resumes exactly where Tiebe left off within today's Due-card set (per PRD UJ-1 edge case) — never restarts the Run. |
| Correct on first try | Run | Positive animation; tank fill updates; advance to next Card immediately — no confirmation step in the way. |
| Incorrect attempt (before cap) | Run | Retry-sand surface, "Probeer het nog eens," same Card again — no red, no buzzer, no score change (FR-8). |
| Retry cap exhausted (3 wrong) | Run | Reveal the correct answer plainly, then advance to the next Card — Tiebe is never stuck (FR-8). |
| Run complete, more Due Cards remain | Run → Run | Brief transition into the next Run; "Run X of Y" stays visible throughout. |
| Daily Session complete | → Liftoff | Automatic transition; the single daily climax. |
| Settings: lowering a Number Range | Settings | Confirmation popup naming that in-range progress will be lost before applying (FR-12). |
| Settings: raising a Number Range | Settings | Applies immediately, no confirmation (non-destructive). |

## Interaction Primitives

- Tap to advance everywhere; no swipe or drag gestures in v1 (no drag-and-drop input, per FR-6).
- Type/tap digits on the keypad or direct-digit row, then an explicit submit action `[ASSUMPTION]`.
- Tap targets sized generously for a 7-year-old's fingers on iPad — `[ASSUMPTION]` treat this as at least the standard iOS 44pt minimum, likely larger for the keypad specifically.
- **Banned:** timers, countdowns, buzzers, streak counters, leaderboards, any score/point deduction UI, red error states — all permanently out of scope per the Brief and PRD.

## Accessibility Floor

Behavioral. Visual contrast lives in `DESIGN.md`. `[NOTE]` the Architecture Spine explicitly flags accessibility specifics (contrast, focus order, screen-reader labeling for a 7-year-old reader) as not yet raised in the PRD and "worth a pass once components exist" — the items below are a starting floor, not a closed list.

- Flight Tiers and retry/success states are distinguished by more than color alone (shape/animation, not just star-yellow vs. steady-blue vs. gentle-lilac) — Tiebe is 7 and color vocabulary shouldn't gate understanding.
- Tap targets sized for a young child's motor control, not just adult minimums (see Interaction Primitives).
- Text legible at a young-independent-reader size by default (`DESIGN.md.typography.body`) — no reliance on a system-level accessibility setting to reach baseline legibility.
- `[ASSUMPTION]` Reduce Motion: the Liftoff animation should degrade gracefully to a simple state-change (rocket already flown) rather than block on a system-level "reduce motion" preference — not yet confirmed with a real reduce-motion pass.
- No screen-reader-specific pass has been scoped yet (no accessibility requirement in the PRD); flagged here as an open gap rather than invented.

## Inspiration & Anti-patterns

- **Lifted from Duolingo, Pokémon GO** (per the Brief): the general shape of turning invisible progress (spaced-repetition mastery) into a visible, growing thing worth checking on daily — recombined here as fuel tanks and a rocket rather than restated as gems or XP.
- **Rejected — red X / buzzer / timers on a miss:** an explicit, brief-level design constraint carried through every mechanic since the original brainstorm. A wrong answer is "try again," never a penalty.
- **Rejected — leaderboards / cross-child comparison:** permanently out of scope (Brief, PRD §5) — RekenRaket compares Tiebe only to himself, even once shared with classmates' families.
- **Rejected — streaks / streak resets:** no streak mechanic exists to protect or lose; the daily Liftoff always happens, so there is nothing to reset.

## Key Flows

### Flow 1 — Tiebe's daily rocket run (Tiebe, 7, right after school, on his iPad)

1. Tiebe opens RekenRaket. No login — straight to Home.
2. Home shows his fuel tanks and today's Liftoff hasn't happened yet — rocket's still on the pad.
3. He taps to start; the app quietly computes everything Due today across all 5 tanks and opens the first Run (up to 20 Cards).
4. He reads a Card, types the answer on the keypad (or taps a direct digit if it's under 10).
5. Right on the first try: his tank animates upward, a quick happy beat plays, next Card.
6. He fumbles one: no red, no buzzer — "Probeer het nog eens," same Card again. Third miss: the app just shows him the answer and moves on, no drama.
7. He clears the Run; if more Due Cards remain, a short "Run 2 van 2" beat and he keeps going without re-deciding to continue.
8. **Climax:** every Due Card is done — the rocket lifts off. Today was a mixed bag, so it's a Steady Flight, not Perfect — and it still, fully, launches.
9. He closes the app. A parent glances at Home later, sees the rocket already flown, and TV time gets granted — no negotiation needed.

### Flow 2 — Parent adjusts the math range (a parent, evening, after noticing Tiebe breezing through addition)

1. Parent opens Settings from Home.
2. Sees each Operation (Addition, Subtraction, Multiplication, Division) with its own enable toggle and Number Range.
3. Raises Addition's range from 1–10 to 1–20 — applies immediately, new Cards land in Box 1, no warning needed (non-destructive).
4. Considers lowering Subtraction's range instead; the app warns first that Cards outside the new range — and their progress — will be lost.
5. **Climax:** parent confirms deliberately, understanding the trade-off up front rather than discovering lost progress after the fact — the settings surface stayed a plain, adult tool the whole time, never borrowing Tiebe's playful register.
