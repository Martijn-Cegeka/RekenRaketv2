---
title: "Addendum: RekenRaket"
status: ready
created: 2026-09-10
updated: 2026-09-10
---

# Addendum: RekenRaket

Depth from the brainstorming session that doesn't belong in the brief itself, but is worth having on hand for the PRD and architecture/UX work that follows — mostly the "later" layer parked behind v1.

## Rejected & Why (Worst-Possible-Idea → Flip)

Guardrails first — these are the "never punish" constraint's origin, useful for anyone extending the app later who might otherwise reintroduce one of these by accident:

| Rejected | Flip adopted instead |
|---|---|
| Red X + buzzer on wrong answers | Soft neutral sound, muted color on misses; bright color/celebration reserved for correct answers |
| Take away stars/points on a miss | Points only ever go up; any consistency track is never subtracted from |
| Leaderboard vs. other kids | Compare only to his own past performance |
| Repeat the same problems until perfect in one sitting | Leitner spacing already resurfaces missed cards days later |
| Stern robotic "incorrect, try again" | Warm, silly character voice with rotating gentle encouragement |
| Force a huge deck before any reward | Short daily sessions (5–8 problems) with a guaranteed small reward at the end |
| Scoreboard of the week's mistakes | Mistakes quietly feed the spacing algorithm; the UI only ever surfaces what's mastered |
| Purely random/cosmetic rewards, disconnected from effort | Rewards tied mainly to consistency (showing up), not accuracy |
| Nag with reminder notifications throughout the day | One gentle, ritualized daily invite at a consistent time |
| Reset the streak on a bad day | Grace day mechanic — one rough day never breaks it |

## Parked Feature: Calm Day Mode (detailed design)

Not a standalone feature — an orchestration layer that activates on a rising mistake-rate signal within a session, bundling responses that are each simple on their own:

- Auto-shortens the session once the error rate crosses a threshold, ending on an easy win.
- Swaps in confidence cards (easy, previously-mastered) after two or three consecutive misses.
- Uses gentler Leitner box-interval adjustments on a miss instead of a harsh reset.
- Shifts to a calmer audio tone/background music for the rest of the session.
- Still guarantees a small reward and a liftoff at the end, regardless of score.

## Parked Feature: Grace / Streak-Freeze Mechanic

A "grace day" — one missed or rough day never breaks whatever consistency track exists, optionally gated behind a short check-in exercise rather than given for free. Framed narratively as "the rocket refueling," never as a loss avoided (direct trait transfer from Duolingo's streak-freeze, softened). Depends on there being a streak/consistency track at all, which v1 deliberately does not build.

## Parked Feature: Parent Bridge (Trophy Shelf & Weekly Recap)

Two considered forms, not mutually exclusive:
- **Trophy shelf** — a browsable view of mastered cards/topics, for parents and grandparents.
- **Weekly narrative recap** — a short story-style summary of the week's practice, meant to be read aloud together, replacing a bare stats/percentage view. Percentages were specifically flagged as not meaningful to a 7-year-old — descriptive milestone badges (e.g., "Addition Explorer") were considered the more legible alternative.

## Options Considered

### Reward Type

- Cosmetic collectibles (stickers, rocket parts, avatar/costume unlocks)
- Narrative progression (unlocking the next chapter of an ongoing story)
- Real-world bridge (printable certificate; the TV-time mechanic chosen for v1 is this category)
- Social reward (a recorded video/audio message sendable to grandparents on a milestone)

### Timing & Pacing

- End-of-session-only reward vs. a mid-session micro-celebration every N correct answers in a row
- Weekly recap ceremony (see Parent Bridge above)
- Fixed short daily session (5–8 minutes) vs. adaptive length (stop early on dropping focus/accuracy, extend gently if he's in flow). Note: the Worst-Possible-Idea flip above independently arrived at "5–8 problems" per session — the two were never reconciled to a single unit, since v1 doesn't scope session length either way.

### Feedback Tone

- Character-narrated encouragement with named praise ("nice one!")
- Understated, matter-of-fact tone for routine correctness, saving big celebration for real milestones. The two aren't mutually exclusive: the brainstorm's convergent theme was that routine feedback should stay calm precisely so milestone moments (like Perfect Flight) can stand out.

## Backlog Ideas Not Yet Committed

Raw ideas surfaced during brainstorming that were not folded into a chosen direction or v1 scope, kept here in case they're useful later.

**Companions & progression**
- A virtual pet/buddy companion, fed by completed exercises, whose mood reflects consistency rather than perfection
- A world map where each new topic (addition, subtraction, multiplication) unlocks a new island/planet
- A "boss-level" review day — appearing only after many successful smaller reviews — with fun boss-battle graphics for the hardest Leitner-box cards
- Mystery boxes / variable-ratio surprise rewards at unpredictable intervals
- Collectible creatures unlocked by mastering specific fact families

**Session UX**
- Color-coded operation types (e.g., blue for addition, orange for subtraction) as a pre-reading cue
- Large tap targets / drag-to-answer instead of typing digits
- An emotion check-in (tap a face) at session start and end, feeding the adaptive-tone system
- An optional practice-together mode where a parent sits in
- The session always resumes exactly where he left off (from audiobook-app trait transfer)

**Pacing & well-being**
- A "don't break the chain" style calendar view using friendly icons rather than fire/streak numbers
- A friendly on-screen nudge to take a break after a long session (Nintendo-style healthy-pacing reminder)

