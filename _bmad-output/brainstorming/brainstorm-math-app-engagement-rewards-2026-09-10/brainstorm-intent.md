---
source: brainstorm-math-app-engagement-rewards-2026-09-10
type: brainstorm-intent
---

# Brainstorm Intent: RekenRaket Engagement & Rewards

## Topic / Goal

RekenRaket is a playful Leitner-method math practice app for a 7-year-old beginner reader. Goal: design engagement mechanics and adaptive rewards that keep him motivated, reward him appropriately, and handle higher-mistake days without discouragement — accounting for his beginner reading level.

## Confirmed Chosen Directions

1. **Rocket / fuel-tank growth metaphor mapped to Leitner boxes** — each Leitner box is visualized as a fuel tank that fills as cards graduate. This lets a 7-year-old see progress ("fuel filling up") without needing to read box labels, solving the reading-beginner abstraction problem for spaced repetition while carrying both the reward and progress systems.
2. **Audio-first, icon-first UI** — full audio narration for every instruction and piece of feedback; icon/emoji-first UI with minimal text; eliminates reliance on reading. A friendly narrator character speaks instructions instead of relying on text.
3. **Grace mechanic that protects streaks without ever punishing** — a "grace day"/streak-freeze/grace-token mechanic: one missed or rough day never breaks the streak (optionally via a short check-in exercise). Framed narratively as "the rocket refueling," not as a loss avoided.
4. **Auto-triggered Calm Day Mode** — not a separate feature, but an orchestration layer that activates on a rising mistake-rate signal. It bundles already-designed responses: shortened session, swap-in of confidence cards (easy, previously-mastered), gentler/calmer audio tone, and a guaranteed small reward at the end regardless of score.
5. **Parent-facing story/trophy recap** — bridges in-app rewards to real-world praise: a trophy-shelf view of mastered cards, and/or a short weekly narrative recap parents can read aloud together, rather than a bare stats/percentage dashboard.
6. **Daily liftoff mechanic** — the rocket lifts off whenever the day's assigned exercises are completed. Liftoff always happens on completion; the animation varies by result via **three tiers keyed to the day's error rate**:
   - **Perfect Flight**: fireworks, full star trail, possibly a new planet glimpsed in the distance.
   - **Steady Flight**: normal liftoff, solid trail, everyday music.
   - **Gentle Flight** (rough day): smaller, calmer liftoff, soft trail, warm music.
   Every tier ends with him airborne — never grounded. Tiers are not explicitly labeled/named to the child. This mechanic is the concrete embodiment of directions 1 (rocket/fuel-tank growth) and 4 (Calm Day Mode never withholds the win).

## Underlying Design Constraints (recurred throughout, treat as hard constraints)

- **Never punish**: no red X, no buzzer sound, no leaderboard or comparison to other kids, no timers/countdowns, no failure screens, no streak resets, no taking away points or stars for wrong answers.
- **Continuous, warm feedback over binary right/wrong**: reframe misses as "near miss" (e.g., show how close the number was) or "not yet" rather than "wrong"; wrong answers should wiggle and invite retry, not turn red/scary; save bright color and big celebration for correct answers and real milestones, keep routine feedback understated.
- **Reward decoupled from correctness, tied to consistency**: points only ever go up; a separate streak/consistency track is never subtracted from; rewards (avatar/costume unlocks, streak visuals) reward showing up, not just being right — since a 7-year-old's effort does not equal correctness.
- **Compare only to self**: progress comparisons reference his own past performance, never other children.
