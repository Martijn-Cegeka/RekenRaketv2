---
title: "Product Brief: RekenRaket"
status: ready
created: 2026-09-10
updated: 2026-09-10
---

# Product Brief: RekenRaket

## Executive Summary

RekenRaket is a math practice app built around the Leitner spaced-repetition method, designed for one very specific user first: a 7-year-old, beginner-reading boy who loves rockets. It turns the abstract mechanics of spaced repetition — cards moving between boxes as they're mastered — into something he can see and feel without reading a word. Each Leitner box is a fuel tank on his rocket, filling up as he practices, and every day he finishes his assigned exercises, the rocket lifts off. The problem it solves is simple but real: physical Leitner box systems are high-friction to run daily with a young reader, and most digital math apps lean on reading-heavy UI and punishing game mechanics that don't fit a 7-year-old still building confidence. RekenRaket is audio-first and icon-first so he can use it independently, and it's built to be shared as-is: if it works for him, the plan is to hand it to a few other parents in his class facing the same daily-practice-habit problem. Version 1 is deliberately narrow — the fuel-tank visualization and the daily liftoff — proven with one real kid before anything else is added.

## The Problem

Building a daily math practice habit with a 7-year-old beginner reader is harder than it should be. Physical Leitner flashcard systems work well as a spaced-repetition method, but running one by hand — sorting cards between boxes, figuring out which box is due — adds friction that falls on the parent, not the child, and doesn't hold a young reader's attention on its own. Most existing digital math apps assume the child can read instructions and feedback — a skill this age/stage genuinely can't yet rely on — and many lean on punishing mechanics that are demotivating for a kid who is still building math confidence. The result: practice becomes a chore to enforce rather than something he wants to do, and progress is invisible to him in a way he can actually parse (a box number or a percentage means nothing at 7).

## The Solution

RekenRaket digitizes the Leitner method behind a rocket-growth metaphor a 7-year-old can read at a glance: each box is a fuel tank, and watching it fill up *is* the progress indicator — no box numbers or percentages required. The whole experience is audio-first and icon-first: a narrator character speaks every instruction and every piece of feedback, so the app is usable without reading a single word. Every day he completes his assigned exercises, the rocket lifts off — always. The liftoff has three unlabeled tiers keyed to that day's accuracy (Perfect / Steady / Gentle Flight), so a rough day still ends in a real, satisfying liftoff, just calmer — he is never left grounded or told he failed. That daily liftoff is designed to be a clear, parent-visible signal: "did he do his practice today?" — clean enough to tie directly to an existing real-world reward his parents already use, TV time.

## What Makes This Different

Against the physical Leitner box: RekenRaket removes the manual sorting and reading friction entirely, and makes progress visible to the child himself rather than only legible to a parent.

Against reading-heavy or punish-mechanic math apps: the audio-first/icon-first design isn't a nice-to-have — it's load-bearing; it's what makes the app usable at all for a true beginner reader. The "never punish" stance (no red X, no buzzer, no timers, no leaderboard, no streak resets) is an explicit design constraint identified during the original brainstorming session and carried through every mechanic since, not an incidental style choice.

Honestly: there's no technical moat here, and this brief won't pretend otherwise. The mechanics draw on well-established patterns from Duolingo, Pokémon GO, and similar apps, recombined for this reading stage and this child. The real advantage is fit — this is being designed and tuned against one real kid's actual reactions before it's handed to anyone else, and the stakes are low enough to genuinely iterate rather than ship-and-hope.

## Who This Serves

**Primary user:** a 7-year-old, beginner-reading boy who loves rockets, needs low-friction daily math practice, and is motivated by visible progress and a consistent, non-punishing daily ritual. Success for him looks like: he wants to do it, the rocket flies every day he practices, and a rough day doesn't feel like a loss.

**Secondary users:** classmates of similar age and reading level, whose parents face the same daily-practice-habit problem. Each family runs its own independent instance — see Scope for the no-cross-child-comparison constraint that carries over once the app is shared beyond one household.

**Parents (all households):** the audience for the daily liftoff signal itself — a quick, legible answer to "did today's practice happen?" that they can act on directly (e.g., granting TV time), without digging into a stats dashboard.

## Success Criteria

Given the personal/small-scale nature of this project, these are meant to be judged by observation (does he ask to play, does the TV-time routine go smoothly) rather than by analytics or dashboards.

- **Daily practice consistency** — he does it regularly, without it becoming a fight to start each session.
- **Lower friction than the physical Leitner boxes** — practice actually happens more often/more easily than the paper-card version did.
- **A little joy in the moment** — some visible delight in using the iPad app itself, not just tolerance of "homework."
- **The TV-time reward loop works cleanly** — a parent can tell from the app, in a glance, whether today's liftoff happened, and grant the reward without negotiation or ambiguity.

## Scope

**Platform:** iPad as the primary target device, with mobile and desktop as secondary targets. Greenfield build — no existing codebase or tech-stack decisions yet; that's an architecture-phase question, not a brief-phase one.

**In for v1:**
- Fuel-tank visualization of the Leitner boxes (the core progress metaphor)
- Daily liftoff mechanic with the three accuracy-keyed tiers (Perfect / Steady / Gentle Flight), unlabeled to the child
- Audio-first, icon-first UI — full narration, minimal-to-no reading required
- Simple enough distribution to hand to a small number of other families (classmates) without app-store-scale packaging

**Deferred to a later version:**
- **Calm Day Mode** — the auto-triggered adaptive-difficulty orchestration layer (shorter session, swapping in easy previously-mastered confidence cards, and a gentler tone) — confirmed deferred by the user.
- Grace/streak-freeze mechanic (protecting a streak across a missed day)
- Trophy shelf and weekly narrative recap for parents

**Permanently out of scope:**
- Any cross-child comparison, leaderboard, or shared view between families. This is a hard constraint carried from the brainstorm ("compare only to self"), and matters more, not less, once the app is shared beyond one household.

## Vision

If this works for him, the next layer is already designed but deliberately held back from v1: Calm Day Mode softening rough days, a grace mechanic so one missed day never breaks momentum, and a trophy-shelf/weekly-recap bridge that gives parents — his own, and eventually other families' — something warmer than a stats screen to share with their kids. Beyond that, if a handful of classmates' families genuinely want it, this could quietly grow into a small, trusted, non-commercial tool passed between parents who've hit the same problem — not a product launch, just a good habit-building tool that outgrew one household. Any wider ambition than that is out of scope for now and shouldn't shape v1 decisions.

## Assumptions Carried Forward

Inferred during drafting (fast path) and confirmed by the user on review:

- Audio-first, icon-first UI is a foundational v1 requirement — necessary for the child to use the app independently at all, not an optional polish item.
- Distribution to other families is simple/informal sharing, not app-store-scale packaging.
- The grace mechanic, trophy shelf, and weekly recap are deferred alongside Calm Day Mode, since v1 was tightened to just the fuel-tank visualization and daily liftoff.
- The TV-time reward loop needs no formal in-app streak/rewards ledger in v1 — the daily liftoff itself is the signal a parent checks.
- Success is judged by observation (does he ask to play, does the TV-time routine go smoothly), not analytics or dashboards, given the personal/small-scale nature of this project.
