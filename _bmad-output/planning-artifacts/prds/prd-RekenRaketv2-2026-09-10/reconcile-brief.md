---
title: "Reconciliation: Brief vs PRD — RekenRaket"
created: 2026-09-11
---

# Reconciliation: brief.md → prd.md

Inputs read:
- `briefs/brief-RekenRaketv2-2026-09-10/brief.md`
- `briefs/brief-RekenRaketv2-2026-09-10/addendum.md`
- `prds/prd-RekenRaketv2-2026-09-10/prd.md`
- `prds/prd-RekenRaketv2-2026-09-10/.memlog.md`

Legend: **(a)** faithfully carried · **(b)** deliberately superseded, memlog-backed · **(c)** silently dropped / unexplained gap

## 1. Core claims, requirements, scope items

| # | Brief/addendum item | PRD treatment | Cat. | Notes |
|---|---|---|---|---|
| 1 | Audio-first / narrator speaks every instruction & feedback — "load-bearing," not a nice-to-have | Explicitly dropped; §5 Non-Goals, §6.2 | (b) | Memlog: "Narrator/audio-first dropped entirely for v1." Rationale (Tiebe now reads) is stated in both PRD §1 and memlog. Consistent. |
| 2 | Icon-first UI (paired with audio-first) | Retained loosely ("icon-supported on-screen UI") but not restated as an explicit design principle/FR | (b)/(c) borderline | Not contradicted, but weakened to an aside in §1 Vision with no FR backing it. Minor. |
| 3 | Fuel-tank visualization of Leitner boxes as core progress metaphor | §4.1, FR-1, FR-2 | (a) | Faithful, elaborated with box count (5) and proportional-fill detail. |
| 4 | Rocket lifts off every day he finishes practice — always, never grounded | §4.4 FR-9: "A Liftoff always occurs... there is no 'no liftoff' or failure state" | (a) | Faithful. |
| 5 | Three unlabeled liftoff tiers (Perfect/Steady/Gentle) keyed to daily accuracy | FR-9, with concrete cutoffs (≥90% / 60–89% / <60%) | (a) | Faithful; cutoffs are new specificity, logged in memlog as adopted proposal. |
| 6 | "Never punish" stance: no red X, no buzzer, no timers, no leaderboard, no streak resets | §1 Vision restates verbatim; §5 Non-Goals "No point/streak/score deduction... ever" | (a) | Faithful, called out as unchanged explicitly. |
| 7 | Daily liftoff as parent-visible signal tied to TV-time reward | FR-10, SM-2 | (a) | Faithful. |
| 8 | Session length: short daily sessions (addendum's flip: 5–8 problems, guaranteed small reward, to avoid "force a huge deck before any reward") | Replaced with due-card model: all cards due today, batched in Runs of up to 20, however many Runs it takes | (b) | Memlog: "Session structure changed from brief's fixed 5-8 problems... due-card model." Logged, but see §2 flag below — this reintroduces exactly the "large deck before reward" shape the addendum's flip was designed to avoid, and that tension isn't acknowledged anywhere. |
| 9 | Addendum flip: "Repeat the same problems until perfect in one sitting" (rejected) → "Leitner spacing already resurfaces missed cards days later" (adopted instead) | FR-8: on a miss, Tiebe **retries the same Card immediately until correct**, before moving to the next Card | (b), but see flag | Memlog logs the retry-until-correct decision but never cross-references this addendum guardrail it appears to reverse. See §2. |
| 10 | Addendum flip: rewards tied mainly to consistency (showing up), not accuracy — reacting against "purely random/cosmetic rewards disconnected from effort" | Flight Tier is driven entirely by First-Attempt Accuracy (FR-9); only the base Liftoff (always happens) is consistency-based | (b), partial | Defensible reading (guaranteed liftoff = consistency reward; tier = accuracy-based flavor on top), but PRD never states this reconciliation explicitly, and memlog doesn't reference the addendum guardrail when adopting accuracy-based tier cutoffs. |
| 11 | Feedback-tone calibration: understated/matter-of-fact for routine correctness, saving celebration for real milestones (so Perfect Flight can stand out); "warm, silly character voice with rotating gentle encouragement" replacing "stern robotic incorrect, try again" | Not addressed. FR-7 only says "Positive visual/animation feedback plays" on correct; FR-8 only says what's absent on a miss (no red X/buzzer) | (c) | Silently dropped. This is exactly the kind of qualitative/tone idea the task asked to watch for — the calm-routine/big-milestone calibration and the "warm" character of feedback aren't captured anywhere in the PRD, even in a non-narrated form (e.g. as copy/animation tone guidance for later UX work). |
| 12 | Addendum flip: soft neutral sound + muted color on a miss (replacing red X/buzzer); bright color/celebration reserved for correct answers | Not restated — PRD only negates the rejected pattern (no red X/buzzer), doesn't specify the adopted replacement | (c) | Related to #11; likely intended for UX phase, but the brief/addendum framed it as a locked design constraint, not an open question. |
| 13 | Answer/retry input, card resuming, etc. | FR-6 (numpad + direct digit buttons), UJ-1 mid-Run resume | (a) | Faithful, elaborated; both logged as confirmed/resolved in memlog. |
| 14 | Math content: unscoped "math practice" | §4.5 configurable Operations + Number Ranges | (b) | New elaboration, not a contradiction; memlog: "Math scope v1 expanded beyond brief." |
| 15 | Permanently out of scope: any cross-child comparison/leaderboard between families ("compare only to self") | §5 Non-Goals, §6.2 | (a) | Faithful, called out as permanent in both. |
| 16 | Deferred: Calm Day Mode, grace/streak-freeze, trophy shelf/weekly recap | §5, §6.2 list all three as deferred | (a) | Faithful. |
| 17 | Distribution: simple/informal sharing to a few families, no app-store-scale packaging | §6.1 In Scope | (a) | Faithful. |
| 18 | Platform: iPad primary; mobile/desktop secondary; greenfield, tech-stack decisions deferred to architecture | Not restated anywhere in the PRD (no Platform section, no mention of iPad/mobile/desktop targets) | (c) | Unlike offline support — which PRD §6.2 explicitly flags as "left to the architecture phase, not scoped here" — the platform-target info from the brief has no equivalent placeholder or forward-reference in the PRD. An architecture-phase reader gets no signal that iPad-primary/mobile-secondary was already decided in the brief. |
| 19 | Success criterion: "Lower friction than the physical Leitner boxes — practice actually happens more often/more easily than the paper-card version did" | Not present in §7 Success Metrics (SM-1–SM-3, SM-C1 cover daily consistency, TV-time loop, delight, and a counter-metric — none reference comparison to the old paper system) | (c) | Silently dropped success criterion. Worth flagging since it's one of only four criteria in the brief and speaks to the core "why build this at all" motivation (friction reduction vs. physical Leitner). |
| 20 | Parents as an explicit secondary audience for the liftoff signal | PRD 2.1 JTBD includes a parent job; §1 references classmates/families | (a) | Faithful. |
| 21 | "No technical moat, real advantage is fit with one real kid, low stakes to iterate" — positioning rationale | Not restated (expected — this is exec-summary rationale, not a requirement) | (a) | Not a gap; PRD §0 correctly scopes itself to what changed/got specific, not a re-derivation of brief rationale. |
| 22 | Vision: possible future growth to other families, "not a product launch" | PRD §1 restates the classmates-sharing intent; doesn't re-litigate the "not a product launch" framing but doesn't contradict it either | (a) | Faithful in substance. |

## 2. Flagged concerns (ranked)

1. **Retry-until-correct (FR-8) vs. the addendum's explicit rejection of "repeat the same problem until perfect in one sitting."** The addendum's Worst-Possible-Idea table lists this exact pattern as *rejected*, with "Leitner spacing already resurfaces missed cards days later" as the adopted alternative — i.e., the original design intent was to let spaced repetition (not immediate in-session drilling) handle re-exposure. FR-8 has Tiebe retry the same Card immediately, in-session, until correct. The memlog records this as a deliberate decision ("Retry-until-correct: on a wrong answer he retries until correct before the card can progress") but never acknowledges or reconciles it against the addendum guardrail it appears to reverse. This is the most substantive tension found — not necessarily wrong, but undocumented as a conscious trade-off.

2. **Feedback tone/warmth is unaddressed.** The brief/addendum are explicit that the *character* of feedback matters as much as the absence of punishment: "warm, silly character voice," "soft neutral sound, muted color" on a miss, and "understated routine feedback so milestone moments can stand out." The PRD's FR-7/FR-8 only specify what's *absent* (no red X, no buzzer) and a generic "positive visual/animation feedback." None of the positive tone guidance survives, even as a UX-phase forward-reference. Given the task's specific concern about tone/voice/feel being lost in a dry FR-structured PRD, this is the clearest instance of that happening.

3. **"Lower friction than physical Leitner boxes" success criterion is missing from §7.** It's one of four criteria in the brief's Success Criteria section and speaks directly to the project's core motivation; the PRD's three success metrics don't cover it in any form.

4. **Session-length philosophy: due-card/Run model (up to 20+ cards) vs. addendum's "short sessions, 5–8 problems, guaranteed small reward" flip.** Logged as a deliberate change in the memlog, so this is technically category (b), not (c) — but the memlog doesn't engage with *why* reintroducing a potentially-large single-sitting deck is still consistent with the "never force a huge deck before any reward" guardrail that motivated the original 5–8 number. Worth a sanity check with the user, even though it's not a silent drop.

5. **Platform target (iPad primary, mobile/desktop secondary) has no forward-reference in the PRD**, unlike offline support which is explicitly flagged as deferred-to-architecture. Low risk (it's genuinely an architecture-phase decision either way), but inconsistent treatment compared to how the PRD handles other deferred-to-architecture items.

## 3. Memlog cross-check

All deviations the PRD calls out in its own §0/§9 ("deviates from the brief") do have corresponding memlog entries: narration drop, session/batching model change, FR-8 Box-1-on-miss correction, FR-12 Number Range semantics. No PRD deviation was found that lacks *any* memlog trace. The gaps above are about the brief's material not making it into the PRD at all (or losing its qualitative substance), not about undocumented PRD deviations from the brief's explicit requirements.
