---
title: RekenRaket
status: final
created: 2026-09-10
updated: 2026-09-11
---

# PRD: RekenRaket

## 0. Document Purpose

This PRD is for Martijn, building RekenRaket for his son Tiebe (7), and for whoever picks up architecture/UX work next. It builds on [brief.md](../../briefs/brief-RekenRaketv2-2026-09-10/brief.md) and [addendum.md](../../briefs/brief-RekenRaketv2-2026-09-10/addendum.md) from the earlier brainstorm/brief pass — it does not duplicate that material, only what changed or got more specific is restated here. Several decisions below **deviate from the brief** (most notably: narration is dropped for v1, and the daily session mechanic changed from a fixed problem count to a due-card model); these are called out explicitly rather than silently overriding the brief. Vocabulary is Glossary-anchored (§1); features are grouped with globally-numbered FRs nested under them; assumptions are tagged inline and indexed in §9.

## 1. Glossary

- **Leitner Box (Fuel Tank)** — one of 5 sequential mastery stages a Card moves through. Visualized as a fuel tank on the rocket that fills as Cards accumulate in it. Box 1 = least mastered/newest, Box 5 = most mastered.
- **Card** — a single math problem instance tied to one Operation and one specific fact (for example, 7×5), tracked individually through the Leitner Boxes.
- **Due** — a Card scheduled for review today, per its current box's review interval.
- **Run (Batch)** — a group of up to 20 Due Cards presented together. A Daily Session may require multiple Runs if more than 20 Cards are Due.
- **Daily Session** — the full set of Runs needed to clear all of a day's Due Cards; ends in exactly one Liftoff.
- **First-Attempt Accuracy** — whether a Card's first answer that day was correct. Retries on that Card do not change its recorded first-attempt result.
- **Liftoff** — the rocket-launch moment closing a completed Daily Session. Occurs exactly once per day, only after every Run is finished.
- **Flight Tier** — one of three unlabeled Liftoff outcomes (Perfect / Steady / Gentle Flight), set by First-Attempt Accuracy across the Daily Session.
- **Operation** — one of the four supported math operation types: Addition, Subtraction, Multiplication, Division.
- **Number Range** — the configurable min/max operand bounds set independently per Operation, bounding which Cards can be generated for it.

## 2. Vision

RekenRaket is a math practice app built around the Leitner spaced-repetition method, designed first for one real user: Tiebe, 7, who loves rockets. It turns the abstract mechanics of spaced repetition — cards moving between boxes as they're mastered — into something he can see: each of the 5 Leitner boxes is a fuel tank on his rocket, filling as cards accumulate there. Every day he finishes his due practice, the rocket lifts off — always, just with a different flight tier depending on how the day went, so a rough day never feels like a loss.

Unlike the original brief's audio-first framing, Tiebe now reads independently, so v1 drops narration and leans on a readable, icon-supported on-screen UI instead. The "never punish" stance carries through unchanged: no red X, no buzzer, no timers, no leaderboard, no streak resets — a wrong answer means "try this one again," not a penalty.

If it works for Tiebe, the plan (per the brief) is still to hand it to a few classmates facing the same daily-practice-habit problem — each family running its own independent, non-comparing instance.

## 3. Target User

### 3.1 Jobs To Be Done

- As Tiebe, I want to do my daily math practice quickly and without dread, so I get to a satisfying liftoff every day.
- As Tiebe, I want to see my progress as something concrete (fuel tanks filling, a rocket flying), not numbers or percentages.
- As a parent, I want a single glance to tell whether today's practice happened, so I can grant TV time without negotiation.

### 3.2 Key User Journeys

- **UJ-1. Tiebe does his daily rocket run.**
  - **Persona + context:** Tiebe, 7, loves rockets, reads independently, practices math daily via Leitner spaced repetition on a shared-nothing (single-child) iPad install.
  - **Entry state:** Opens RekenRaket; no login; app goes straight to today's practice.
  - **Path:**
    1. App computes all Cards Due today across the 5 fuel tanks (Boxes) and starts the first Run (up to 20 Cards).
    2. For each Card, Tiebe reads the problem on-screen and types the answer on a numeric keypad (or taps a direct digit button if the answer is under 10).
    3. Correct on the first try: the Card advances one box; its fuel tank animates upward; positive visual feedback plays.
    4. Incorrect: no punishing feedback (no red X/buzzer); he retries the same Card until correct. The Card drops back to Box 1 (per the classic Leitner method) regardless, and the initial miss counts against today's accuracy — but he keeps going.
    5. He finishes the Run; if more than 20 Cards were Due, he starts another Run with the same mechanics, until every Due Card for the day is cleared.
  - **Climax:** Once every due Card for the day is done — across however many Runs it took — the rocket lifts off. The Flight Tier (Perfect / Steady / Gentle Flight) reflects the day's first-attempt accuracy, but a liftoff always happens.
  - **Resolution:** A parent notices the liftoff happened and grants TV time; Tiebe closes the app, ritual done for the day.
  - **Edge case:** If he closes the app mid-Run, the session resumes where he left off within that day's due-card set next time he opens the app, rather than restarting.

## 4. Features

### 4.1 Fuel-Tank Progress Visualization
**Description:** Each of the 5 Leitner Boxes is shown as a fuel tank on Tiebe's rocket. As Cards accumulate in a box, its tank visibly fills — no box numbers or percentages shown. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Fuel tank display
System displays 5 fuel tanks, one per Leitner Box, each showing a fill level proportional to the number of Cards currently held in that box, relative to the total deck size.

**Consequences (testable):**
- Tank visuals update immediately after any Card moves between boxes.
- No numeric labels or percentages are rendered anywhere in the child-facing view.

#### FR-2: Fuel tank view outside of a session
Tiebe can view current fuel-tank state from the app's home/start screen at any time, without starting a session.

**Consequences (testable):**
- The fuel-tank view is reachable from the home/start screen without triggering a Daily Session.

---

### 4.2 Daily Practice Session & Batching
**Description:** Governs due-card computation and how a day's practice is chunked into Runs. Realizes UJ-1.

**Functional Requirements:**

#### FR-3: Due-card computation
System determines the full set of Cards Due today, across all 5 Leitner Boxes, at the start of the Daily Session.

**Consequences (testable):**
- The Due-card set is computed once at session start. Cards that become newly Due later the same day are not added until the next Daily Session.

#### FR-4: Batching into Runs
System presents Due Cards in Runs of at most 20 Cards each.

**Consequences (testable):**
- If more than 20 Cards are Due, Tiebe completes multiple Runs (each capped at 20) until all Due Cards for the day are exhausted.
- Progress across Runs within the same day is preserved and visible via a simple "Run X of Y" indicator.

#### FR-5: Single daily Liftoff
System triggers exactly one Liftoff per day, only after every Due Card across all Runs has been completed.

**Consequences (testable):**
- No liftoff/reward screen appears at the end of an individual Run while Due Cards remain in later Runs.

---

### 4.3 Answer & Retry Mechanic
**Description:** No punishing feedback, ever. A wrong answer is retried until correct, but the Card does not advance that day. Realizes UJ-1.

**Functional Requirements:**

#### FR-6: Answer input
Tiebe answers each Card by typing on a numeric keypad. If the correct answer is a single digit (0–9), the system shows direct number buttons instead of the full keypad. No drag-and-drop input in v1.

**Consequences (testable):**
- Only digits 0–9 are available as input; no negative-sign, decimal, or fraction entry in v1.
- [ASSUMPTION: An explicit submit action confirms an answer, rather than auto-submitting once a fixed digit count is reached.]

#### FR-7: Correct-first-try advancement
On a correct first attempt, the Card advances one Leitner Box.

**Consequences (testable):**
- Positive visual/animation feedback plays.
- The Card's first-attempt result is recorded as correct for that day's Flight Tier calculation.

#### FR-8: Retry-until-correct on a miss, capped
On an incorrect attempt, the system prompts Tiebe to retry the same Card, without punishing feedback (no red X, no buzzer, no point/score deduction). After [ASSUMPTION: 3] consecutive wrong attempts on the same Card, the system moves on to the next Card in the Run regardless — a Card never blocks the Run indefinitely.

**Consequences (testable):**
- The Card does not advance to the next box that day. Instead, per the classic Leitner method, it drops back to Box 1 — whether it was eventually answered correctly within the retry cap or moved on after exhausting it.
- Only the first attempt's correctness is recorded toward the day's Flight Tier; further retries (and reaching the cap) do not additionally affect the tier calculation.
- Tiebe must either answer the current Card correctly or exhaust the retry cap before moving to the next Card in the Run.
- If the retry cap is exhausted without a correct answer, the system reveals the correct answer before moving on.

**Out of Scope:** Any point, streak, or score deduction mechanic — permanently out of scope per the brief.

---

### 4.4 Daily Liftoff & Flight Tiers
**Description:** The closing ritual of every Daily Session, and the parent-visible signal the reward loop hangs on. Realizes UJ-1.

**Functional Requirements:**

#### FR-9: Liftoff with Flight Tier
Upon Daily Session completion, the system shows a Liftoff with one of three Flight Tiers — Perfect / Steady / Gentle Flight — set by First-Attempt Accuracy across all Cards played that day.

**Consequences (testable):**
- A Liftoff always occurs on Daily Session completion; there is no "no liftoff" or failure state.
- Tier cutoffs (initial proposal, to be tuned against real use): Perfect Flight ≥ 90% first-attempt accuracy, Steady Flight 60–89%, Gentle Flight below 60%.
- Tiers are visually distinct but unlabeled to Tiebe (no numbers/percentages shown).

**Notes:**
- `[NOTE FOR PM]` Gentle Flight is still a legible "today was rougher" signal even though it's unlabeled and always ends in a liftoff — it's a tier, not a red X or a percentage. No unlabeled alternative fully avoids this trade-off; judged acceptable and gentler than a scoreboard.

#### FR-10: Parent-visible Liftoff status
A parent can tell, at a glance, whether today's Liftoff has happened, without digging into a stats view.

**Consequences (testable):**
- Liftoff status is visible on the app's home/start screen after completion — for example, rocket at the launch pad vs. already flown — not only during the animation itself.
- Directly enables the brief's TV-time reward loop success criterion.

---

### 4.5 Math Content Configuration
**Description:** Parent-configurable operation scope, replacing the brief's unscoped "math practice." Each Operation is independently enabled and ranged.

**Functional Requirements:**

#### FR-11: Per-operation enable/disable
A parent can independently enable or disable each of the four Operations (Addition, Subtraction, Multiplication, Division) for Card generation.

**Consequences (testable):**
- Card generation excludes any disabled Operation entirely; no Cards are created or presented for it.

#### FR-12: Per-operation Number Range
A parent can independently set a Number Range (min/max operand bounds) for each enabled Operation.

**Consequences (testable):**
- Card generation for an Operation only produces facts within its configured Number Range.
- Subtraction Cards are only generated where the minuend ≥ subtrahend (non-negative results only); Division Cards are only generated where the divisor evenly divides the dividend (whole-number quotients only).
- Default Number Range for every Operation, before a parent configures it, is 1–1 — deliberately trivial, so no meaningful Cards are generated until a parent explicitly sets a real range.
- Lowering an Operation's Number Range removes Cards whose facts fall outside the new range from their current boxes entirely — their progress is lost.
- Raising an Operation's Number Range adds new Cards for the newly-included facts, starting in Box 1.
- The system shows a warning popup before applying a Number Range change that would remove Cards and lose progress (that is, lowering the range). [ASSUMPTION: raising the range, being non-destructive, does not require the same warning.]

**Notes:**
- `[NOTE FOR PM]` The first time a parent enables an Operation or widens its Number Range, all newly-included facts land in Box 1 as Cards Due immediately — potentially requiring several Runs on day one. This is a known, accepted risk (the parent controls timing), not an oversight.

#### FR-13: Parent-facing settings surface
Configuration in FR-11/FR-12 lives in a settings area separate from Tiebe's play surface.

**Consequences (testable):**
- The settings area is a simple settings screen, with no PIN-lock in v1.

## 5. Non-Goals (Explicit)

- No narration/audio-first UI in v1 — Tiebe reads independently now, and the classmates it may be shared with can too, so the brief's original non-reader rationale no longer applies.
- No login or multi-child profiles — v1 is single-child-per-install.
- No cross-child comparison, leaderboard, or shared view between family instances (permanent, carried from the brief).
- No monetization, ads, or in-app purchases.
- No point/streak/score deduction mechanic of any kind, ever.
- Calm Day Mode, Grace/streak-freeze, and Trophy Shelf/Weekly Recap remain deferred, per the brief.

## 6. MVP Scope

### 6.1 In Scope
- Fuel-tank visualization of all 5 Leitner Boxes (§4.1).
- Due-card daily session with Run-based batching, max 20 Cards/Run (§4.2).
- Retry-until-correct answer mechanic (capped at 3 attempts) with no punishing feedback (§4.3).
- Daily Liftoff with 3 Flight Tiers, once per day (§4.4).
- Parent-configurable Operations (add/sub/mul/div) with independent Number Ranges (§4.5).
- Simple, single-child install, distributable informally to other families' iPads without app-store-scale packaging.

### 6.2 Out of Scope for MVP
- Narration / audio-first UI, Calm Day Mode, Grace/streak-freeze, Trophy Shelf/Weekly Recap, and cross-child comparison — all remain out of scope for MVP; see §5 for the reasoning behind each.
- Offline support — left to the architecture phase, not scoped here.

## 7. Success Metrics

Given the personal, single-family scope, these are judged by observation, not analytics.

**Primary**
- **SM-1**: Daily practice happens without a fight to start. Validates FR-3–FR-9.
- **SM-2**: The TV-time reward loop resolves cleanly — a parent can tell Liftoff status at a glance and grant the reward without negotiation. Validates FR-10.

**Secondary**
- **SM-3**: Visible delight while playing — observed, not measured.
- **SM-4**: Practice happens more often, or more easily, than the physical Leitner-card version did — observed comparison to the prior paper-based routine.

**Counter-metrics (do not optimize)**
- **SM-C1**: Session count or time-on-device should not be pushed upward for its own sake — the goal is a quick, low-friction daily ritual, not maximizing engagement time. Counterbalances SM-1.

## 8. Open Questions

None currently open. All items from the initial draft, plus everything surfaced during input reconciliation and the reviewer pass, were resolved during review — see §9 Assumptions Index for what remains open as an assumption, and the memlog for full resolution history.

## 9. Assumptions Index

- §4.3 FR-6 — An explicit submit action confirms an answer, rather than auto-submitting once a fixed digit count is reached.
- §4.3 FR-8 — Retry cap set at 3 consecutive wrong attempts before the system moves on to the next Card.
- §4.5 FR-12 — Raising an Operation's Number Range (non-destructive) does not require the same warning popup as lowering it.

All other assumptions from the initial draft were confirmed on review (see the memlog for full history): fuel tank fill proportionality (FR-1), same-day newly-due cards not added mid-day (FR-3), the "Run X of Y" indicator (FR-4), liftoff status staying visible on the home screen (FR-10), no PIN-lock on settings (FR-13), and the mid-Run resume behavior (UJ-1). FR-8 was corrected: a missed Card drops back to Box 1 per the classic Leitner method, rather than staying in place. FR-12 was clarified: lowering a Number Range removes out-of-range Cards (and their progress); raising it adds new Cards to Box 1; a warning popup precedes the destructive (lowering) case.
