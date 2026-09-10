---
title: "Reconciliation: Addendum vs PRD"
source: brief-RekenRaketv2-2026-09-10/addendum.md
target: prd-RekenRaketv2-2026-09-10/prd.md
created: 2026-09-11
---

# Reconciliation: Addendum vs PRD

Purpose: check whether the "later" depth parked in the addendum (rejected patterns/guardrails, parked features, options considered, backlog ideas) is still correctly honored, deferred, or in tension with decisions newly made in the PRD.

## (a) Rejected-pattern guardrail check: FR-8 (retry-until-correct) and FR-6 (numeric keypad)

### FR-8 vs "Repeat the same problems until perfect in one sitting"

**Addendum's rejected pattern:** "Repeat the same problems until perfect in one sitting." **Flip adopted instead:** "Leitner spacing already resurfaces missed cards days later" — i.e., don't force mastery of a whole deck in one session; let spaced repetition handle re-exposure across days.

**FR-8's mechanic:** On a miss, Tiebe retries the *same single Card* until correct before moving to the next Card in the Run; the Card then drops to Box 1 regardless, to be resurfaced later per the normal Leitner schedule.

**Verdict: meaningfully different, not a violation — with one caveat.**
- The rejected pattern is about forcing an entire *deck* to be repeated until every card in it is correct within one sitting (a punishing, potentially long grind). FR-8 operates at the single-card level: one wrong Card is retried immediately, then the Card still goes back to Box 1 and is deferred to a future day like any other miss — this is exactly the flip's spirit (spacing handles eventual mastery, not same-session perfection).
- The classic Leitner method itself normally requires "answer correctly before moving on" at the single-card level, so FR-8 is standard Leitner behavior, not a reintroduction of the rejected whole-deck grind.
- **Caveat/gap worth flagging:** FR-8 has no retry cap and no escape valve. "Regardless of how many retries it takes" means a 7-year-old could get stuck cycling on one stubborn Card indefinitely in a single Run. The addendum's own **Calm Day Mode** (parked, not v1) was explicitly designed to catch this exact scenario — it "swaps in confidence cards (easy, previously-mastered) after two or three consecutive misses" — but Calm Day Mode is deferred, so v1 has no relief mechanism if a single Card produces many consecutive failed attempts. This isn't a guardrail *violation* (no red X, no buzzer, no penalty is shown), but it is a UX gap the addendum anticipated and parked a fix for, without the PRD carrying an interim mitigation or noting the risk.

### FR-6 vs rejected patterns

No rejected pattern in the addendum's table concerns input modality (typing vs. tap/drag). The addendum's "Options Considered → Session UX" backlog only lists "Large tap targets / drag-to-answer instead of typing digits" as a raw, uncommitted idea, not a rejected pattern or guardrail. The PRD's numeric-keypad choice (with direct digit buttons under 10) is a legitimate v1 decision, not in tension with any addendum guardrail. No conflict.

## (b) Deferred items still correctly deferred?

Checked against PRD §5 (Non-Goals) and §6.2 (Out of Scope for MVP):

| Parked item (addendum) | PRD treatment | Status |
|---|---|---|
| Calm Day Mode | Explicitly listed as deferred in §5 and §6.2 | ✅ Correctly deferred |
| Grace / streak-freeze mechanic | Explicitly listed as deferred in §5 and §6.2; PRD also correctly notes v1 has no streak/consistency track for it to attach to | ✅ Correctly deferred, and the dependency noted in the addendum ("depends on there being a streak track, which v1 deliberately does not build") is honored — v1 has no streak track at all |
| Trophy Shelf / Weekly Recap | Explicitly listed as deferred in §5 and §6.2 | ✅ Correctly deferred |

No accidental inclusion or contradiction found. One adjacent observation: the addendum flagged that **percentages are not meaningful to a 7-year-old** (raised in the Trophy Shelf/Weekly Recap discussion, favoring descriptive milestone badges over stats). The PRD's Flight Tier (FR-9) internally computes a percentage-based cutoff but explicitly keeps tiers "visually distinct but unlabeled... no numbers/percentages shown" to Tiebe. This honors the addendum's concern correctly — percentages are used only as an internal threshold, never surfaced.

One backlog idea (not a parked feature, not committed) was actually *pulled forward* into v1: "The session always resumes exactly where he left off" (listed under addendum's "Backlog Ideas Not Yet Committed → Session UX"). The PRD's UJ-1 edge case ("If he closes the app mid-Run, the session resumes where he left off...") implements this. That's a scope decision, not a conflict — worth noting only because the addendum labeled it as an uncommitted backlog idea, and the PRD's Assumptions Index/memlog confirms this was a deliberate, reviewed decision (mid-Run resume behavior), so it's properly tracked, not a silent scope-creep.

## (c) Other tensions found

### 1. Session-size guardrail tension: "Force a huge deck before any reward" vs. due-card batching + Number Range defaults

**Addendum's rejected pattern:** "Force a huge deck before any reward." **Flip adopted instead:** "Short daily sessions (5–8 problems) with a guaranteed small reward at the end." The addendum itself separately notes this 5–8 figure was never reconciled with adaptive-length ideas, "since v1 doesn't scope session length either way" at the brief stage.

**PRD's decision:** Daily Session = *all* Due Cards that day, batched into Runs of up to 20 Cards each, with as many Runs as needed; Liftoff happens once, only after every Run is done (FR-3–FR-5).

**Tension:** This is a much larger unit than the "5–8 problems" the guardrail's flip was originally built around, and the PRD does flag the pivot as a deliberate deviation from the brief (§0, memlog) — but it does **not** cross-reference it against the addendum's specific "force a huge deck" rejected pattern. Two concrete scenarios where this could reintroduce the rejected pattern in practice:
- **Default Number Range → real range transition (FR-12):** Every Operation starts at a trivial 1–1 range. The first time a parent sets a real range (e.g., multiplication 1–10), *all* newly-included facts are added to Box 1 at once and are likely Due immediately — this could produce a due-card count well above 20 on day one for that Operation, forcing multiple Runs before the first Liftoff of that expanded scope.
- **Raising a Number Range later (FR-12):** Same mechanic — "adds new Cards for the newly-included facts, starting in Box 1" — can spike the Due count on the day it's raised, again potentially requiring several 20-card Runs before Liftoff.

Neither scenario is capped or smoothed anywhere in the PRD (e.g., no mention of spreading newly-added Box 1 cards across multiple days, or capping how many Runs are required before a day's Liftoff). The guaranteed-reward-at-the-end guardrail is technically preserved (Liftoff still always happens, eventually), but "eventually, after however many 20-card Runs it takes" is a functional reintroduction of "force a big deck before the reward" on the specific days a parent changes configuration — precisely the pattern the addendum's brainstorm rejected. This is worth a decision (either accepted as-is, or mitigated, e.g., staggering newly-added Box 1 cards' due dates) before/along with architecture work.

### 2. Flight Tier as an implicit "scoreboard of mistakes"

**Addendum's rejected pattern:** "Scoreboard of the week's mistakes." **Flip adopted instead:** "Mistakes quietly feed the spacing algorithm; the UI only ever surfaces what's mastered."

**PRD's decision (FR-9):** Liftoff always happens, but its Flight Tier (Perfect / Steady / Gentle) is visually distinct based on the day's First-Attempt Accuracy, i.e., how many mistakes were made that day.

**Assessment — minor tension, not a clear violation:** Unlike the rejected pattern, nothing is *labeled* as a mistake count, there's no numeric scoreboard, and every tier still ends in a celebrated liftoff (no failure state). This is much softer than what was rejected. However, it does mean the day's outcome *visibly and consistently varies with how many mistakes were made* — a perceptive 7-year-old is likely to learn that "Gentle Flight" days are the rough days, which functions as an implicit, low-grade version of a mistake signal the addendum's flip wanted eliminated from the UI entirely. This is likely an acceptable, deliberate trade-off (Flight Tiers are the PRD's core reward-differentiation mechanism, called out in §4.4 and not left as an open question), but it sits closer to the rejected pattern's spirit than the addendum's flips elsewhere — worth being aware of rather than silently assuming full compliance.

## Summary of concerns to carry forward

1. FR-8 has no retry cap/escape valve for a single stubborn Card — the addendum's own parked Calm Day Mode anticipated this exact case but isn't in v1, leaving a UX gap on hard days.
2. FR-3–FR-5's due-card batching, combined with FR-12's Number-Range-driven Box 1 influxes, can produce sessions far larger than the "5–8 problems, guaranteed quick reward" guardrail that originally justified "no huge deck before reward" — most acutely on the day a parent first sets a real Number Range, or raises one later.
3. Flight Tiers (FR-9) are a soft, unlabeled but real signal that varies with mistake count, sitting close to (though clearly not equivalent to) the rejected "scoreboard of mistakes" pattern — likely an accepted trade-off, but not explicitly reconciled against that guardrail in the PRD.
4. No outright accidental inclusion of Calm Day Mode, Grace mechanic, or Trophy Shelf/Weekly Recap was found — all three remain correctly and explicitly deferred, with dependencies (e.g., Grace needing a streak track that doesn't exist) also correctly honored.
