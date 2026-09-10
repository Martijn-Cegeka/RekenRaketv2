# PRD Quality Review — RekenRaket (prd-RekenRaketv2-2026-09-10)

## Overall verdict

This is a tight, well-scoped PRD for what it actually is: a solo builder's spec for his own kid's app. It has a real thesis (make spaced repetition visible and never-punishing), Non-Goals that do real work, and an Assumptions Index that roundtrips cleanly — no theater here. The two things holding it back from "strong" are a genuine content-generation gap (subtraction/division fact validity is never addressed) and a habit of resolving live tensions in the decision log without leaving a trace in the document itself (the Flight Tier "never a loss" framing, and the first-run Box-1 flood risk). Fix the fact-generation gap before anyone builds Card generation off this; the rest is polish.

## Decision-readiness — adequate

The PRD is honest about deviations from the brief and states them as decisions, not soft-pedaled considerations: "Several decisions below **deviate from the brief** (most notably: narration is dropped for v1, and the daily session mechanic changed from a fixed problem count to a due-card model)" (§0). FR-8's retry cap and FR-12's warning-popup asymmetry are both stated as explicit `[ASSUMPTION]`s with reasoning, and §8/§9 show a real resolution history rather than questions answered in the next sentence.

Where it falls short: some real tensions were resolved *outside* the document (per the session's decision log) and left no trace inside it, which means a reader of the PRD alone can't see they were ever considered.

### Findings
- **high** Flight Tier's "never a loss" framing isn't reconciled with its own three-tier design (§1, §4.4 FR-9) — The Vision states "a rough day never feels like a loss," and FR-9 shows tiers as "visually distinct but unlabeled to Tiebe (no numbers/percentages shown)." But a three-tier outcome where one tier (Gentle Flight) is reliably the worst is still legible as "today was a bad day" even unlabeled and even with a liftoff every time — the same tension the brief's original "muted celebration" idea was trying to solve. The PRD never names this trade-off or explains why "distinct but unlabeled" is enough to avoid it re-introducing an implicit pass/fail signal, even though it was explicitly discussed and accepted per the session record. *Fix:* Add a one-line `[NOTE FOR PM]` in §4.4 acknowledging that Gentle Flight is a soft, legible "rough day" signal, and stating why that's judged acceptable (e.g., "it's a tier, not a red X, and there's no visible alternative").
- **medium** First-time Number Range setup can flood Box 1 with zero visibility in the document (§4.5 FR-11/FR-12) — Default range is "1–1 — deliberately trivial" (FR-12), and a parent enabling an Operation with a wide range for the first time creates a large batch of new Box-1 Cards, which (per FR-4's 20-card Run cap) could turn day one into many Runs. This was raised and accepted as "parent controls timing, not a v1 mitigation" per the session record, but the PRD text has no trace of it — no Non-Goal, `[ASSUMPTION]`, or `[NOTE FOR PM]`. *Fix:* Add a short `[NOTE FOR PM]` under FR-12 noting the first-time-setup flood is a known, accepted risk, not an oversight.

## Substance over theater — strong

No boilerplate NFRs (there's no NFR section at all, and nothing is silently filled in with "system must be scalable/secure"). One persona (Tiebe) plus a lightweight parent JTBD — no persona padding. The Vision (§1) is specific to this app (rocket/fuel-tank metaphor, named child, named "never red X" stance) and couldn't be swapped into another PRD unchanged. Non-Goals (§5) reads as considered decisions, not a template section.

## Strategic coherence — strong

The thesis is explicit and features clearly serve it: turn abstract Leitner-box progress into something a 7-year-old can see and never feel punished by. Every Feature in §4 states which UJ it realizes, and Success Metrics (§7) validate the thesis rather than measuring generic engagement — SM-1 ("no fight to start"), SM-2 (parent-visible reward loop), SM-4 (easier than the old paper Leitner cards), with an explicit counter-metric SM-C1 ("session count or time-on-device should not be pushed upward for its own sake"). MVP scope logic is coherent: the core loop (fuel tanks, due-card session, retry mechanic, liftoff, content config) ships; embellishments (Calm Day Mode, Grace/streak-freeze, Trophy Shelf) are deferred rather than watered down into the MVP.

## Done-ness clarity — thin

Most FRs carry explicit, numeric "Consequences (testable)" blocks — FR-9's tier cutoffs ("Perfect Flight ≥ 90%... Steady Flight 60–89%... Gentle Flight below 60%") are a good example of bounds instead of adjectives. But there's one substantive gap and a formatting inconsistency that both matter for story-writing.

### Findings
- **high** Card generation for Subtraction and Division never addresses fact validity (§4.5 FR-11, FR-12) — Number Range only bounds "min/max operand bounds." Nothing states whether Subtraction Cards are constrained to non-negative results, or whether Division Cards are constrained to whole-number quotients. FR-6's answer input is a plain numeric keypad — no negative-sign or fraction/decimal affordance is mentioned — implying negative or non-integer answers aren't actually supported, which means naive Card generation from an arbitrary Number Range would produce unanswerable Cards. This is a correctness gap in the core content-generation mechanic, not an edge case. *Fix:* Add a Consequence to FR-11/FR-12 stating the generation constraint (e.g., "Subtraction Cards are only generated where minuend ≥ subtrahend; Division Cards are only generated where the divisor evenly divides the dividend").
- **medium** FR-8's retry cap doesn't say whether Tiebe ever sees the correct answer (§4.3 FR-8) — After 3 consecutive wrong attempts "the system moves on to the next Card in the Run regardless." Pedagogically this matters: does the app reveal the right answer before moving on, or does Tiebe simply never learn it that day? Not stated either way.
- **low** Several FRs lack the "Consequences (testable)" block used elsewhere, with no stated reason (FR-2, FR-6, FR-11, FR-13) — FR-1, FR-3, FR-4, FR-5, FR-7, FR-8, FR-9, FR-10, FR-12 all have one; FR-2 ("Fuel tank view outside of a session"), FR-6 (answer input), FR-11 (enable/disable), and FR-13 (settings surface) don't. FR-6 in particular would benefit — e.g., how an answer is submitted (explicit submit action vs. auto-submit on digit count reached) is never stated.

## Scope honesty — adequate

§5 Non-Goals and §6.2 Out of Scope are both specific and reasoned rather than generic ("No point/streak/score deduction mechanic of any kind, ever" — permanent, not just deferred). The two `[ASSUMPTION]` tags (FR-8, FR-12) both round-trip into §9's index correctly, and §9 also documents what changed from the initial draft, which is unusually transparent for a solo-author PRD. Open Questions is empty ("None currently open"), which per this PRD's hobby/single-family stakes is fine, not a red flag.

The gap is the same one noted under Decision-readiness: two things resolved-but-unrecorded (Flight Tier tension, first-run flood risk) mean the document's own audit trail is slightly less complete than the actual decision history behind it (see findings above — not repeated here to avoid double-counting).

## Downstream usability — adequate

This PRD explicitly feeds "whoever picks up architecture/UX work next" (§0), so this dimension matters more than for a standalone doc. The Glossary (§3) is used consistently in almost every FR — "Card," "Due," "Run," "Daily Session," "Liftoff," "Flight Tier" all stay capitalized and stable across §4. FR IDs (FR-1–FR-13) and SM IDs (SM-1–SM-4, SM-C1) are contiguous with no gaps or duplicates.

### Findings
- **low** Glossary-term casing drifts in UJ-1's prose (§2.3) — "starts the first Run (up to 20 cards)" and "if more than 20 cards were due" use lowercase "cards"/"due," while every FR in §4 capitalizes "Card" and "Due" as defined glossary terms. Minor, but it's the one place casing isn't held to the Glossary.

## Shape fit — strong

This is a hobby/solo, single-protagonist product, and the PRD is shaped accordingly: one named UJ protagonist (Tiebe), no stakeholder sign-off section, no ROI/compliance apparatus, no NFR section manufactured to look complete. It isn't over-formalized (no UJ-per-feature padding) or under-formalized (the one UJ that exists is detailed enough to drive every Feature in §4). This matches the stated Document Purpose exactly.

## Mechanical notes

- **Section numbering gap**: §2 goes from "2.1 Jobs To Be Done" straight to "2.3 Key User Journeys" — there is no 2.2. Either renumber or confirm the gap is intentional (e.g., a placeholder section was removed).
- **Glossary casing drift**: see Downstream usability finding above (UJ-1 prose uses lowercase "cards"/"due" against capitalized Glossary terms elsewhere).
- **Leftover bracket formatting in FR-10** (§4.4) — "[Liftoff status is visible on the app's home/start screen after completion — e.g. rocket at the launch pad vs. already flown — not only during the animation itself.]" is wrapped in square brackets like an unresolved `[ASSUMPTION]`, but §9 lists this as already confirmed ("liftoff status staying visible on the home screen (FR-10)"). The brackets should be removed now that it's settled, or it reads as still-open when it isn't.
- **Assumptions Index roundtrip**: clean. Both live `[ASSUMPTION]` tags (FR-8, FR-12) are indexed in §9, and no index entry lacks an inline tag.
- **UJ protagonist naming**: UJ-1 names Tiebe with context inline ("Tiebe, 7, loves rockets, reads independently...") — no floating UJs, only one UJ total.
- **Working title flag**: the doc header still reads "*Working title — confirm.*" (§ title) — carry-forward item, not a defect, but worth closing out before this PRD is treated as final.
