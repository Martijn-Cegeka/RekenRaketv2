---
name: RekenRaket
description: Rocket-growth math practice for one seven-year-old boy — icon-supported, never-punish, built to make a fuel tank filling up feel like real progress.
status: final
created: '2026-09-11'
updated: '2026-09-11'
colors:
  sky-day: '#CDEBFB'
  sky-horizon: '#EFFAFF'
  space-navy: '#0B1D3A'
  ink-secondary: '#4B5A73'
  panel-white: '#FFFFFF'
  rocket-orange: '#FF7A3D'
  fuel-teal: '#2FD3B0'
  star-yellow: '#FFD65C'
  steady-blue: '#5B8DEF'
  gentle-lilac: '#B79CED'
  retry-sand: '#F3E9DA'
  border-hairline: '#D8E6F0'
typography:
  display:
    note: '[ASSUMPTION] Platform-native rounded system font (SF Rounded on iPadOS). Large, bold. Used only for the Liftoff moment and the fuel-tank numbers-free milestones.'
  heading:
    note: '[ASSUMPTION] Platform-native system font, bold. Section titles on the parent Settings screen.'
  body:
    note: '[ASSUMPTION] Platform-native system font, regular weight, sized for a beginner-independent 7-year-old reader — one step larger than typical adult body text.'
  numeral:
    note: '[ASSUMPTION] Platform-native system font, bold, tabular figures. Used for the numeric keypad and direct-digit buttons — must read instantly at a glance.'
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
components:
  rr-fuel-tanks:
    fill: '{colors.fuel-teal}'
    track: '{colors.border-hairline}'
    radius: '{rounded.lg}'
  rr-keypad:
    key-surface: '{colors.panel-white}'
    key-radius: '{rounded.md}'
    key-text: '{colors.space-navy}'
  rr-liftoff:
    perfect-accent: '{colors.star-yellow}'
    steady-accent: '{colors.steady-blue}'
    gentle-accent: '{colors.gentle-lilac}'
  rr-run-progress:
    track: '{colors.border-hairline}'
    fill: '{colors.rocket-orange}'
  rr-settings-row:
    label: '{colors.space-navy}'
    value: '{colors.ink-secondary}'
    divider: '{colors.border-hairline}'
---

# DESIGN.md — RekenRaket

> `[ASSUMPTION]` markers throughout: drafted fast-path from the PRD and Architecture Spine, without a creative-tools pass (no color-theme or design-direction exploration run yet). Treat every token and visual call below as a strong starting proposal, not a locked decision — cheap to swap before any component ships.

## Brand & Style

RekenRaket is a rocket that only ever goes up. The aesthetic is daytime sky, not deep space — bright, warm, optimistic, and legible to a seven-year-old who is still building both math confidence and reading fluency. Nothing here is allowed to look like a scoreboard: no red, no percentages, no numeric badges anywhere in Tiebe's view. Progress is a fuel tank filling and a rocket climbing, never a number.

`[ASSUMPTION]` The visual register is closer to a friendly picture book than a game-app: soft gradients, rounded shapes, one confident accent color (rocket orange) instead of a busy multi-color game palette. The parent-facing Settings screen is visually the same family but calmer and denser — it's a tool, not a toy.

## Colors

- **Sky Day (`#CDEBFB`) → Sky Horizon (`#EFFAFF`)** — the background gradient for every Tiebe-facing screen. Always daytime; the rocket never launches into darkness.
- **Space Navy (`#0B1D3A`)** — primary ink. Used for body text and the rocket's silhouette, not as a "dark mode" surface — this app has one mode.
- **Ink Secondary (`#4B5A73`)** — supporting text, timestamps, parent-facing meta copy.
- **Panel White (`#FFFFFF`)** — cards, the keypad, the Settings list — anything that needs to sit clearly above the sky.
- **Rocket Orange (`#FF7A3D`)** — the single chromatic accent for primary action: the flame, the "next" affordance, the Settings primary button. Used sparingly, the same way a Do-not-punish app should use its one loud color.
- **Fuel Teal (`#2FD3B0`)** — the fuel-tank fill. This *is* the progress indicator; it never appears anywhere else so its meaning stays singular.
- **Star Yellow (`#FFD65C`)** / **Steady Blue (`#5B8DEF`)** / **Gentle Lilac (`#B79CED`)** — the three Flight Tier accents (Perfect / Steady / Gentle). Deliberately three *different hues*, not a traffic-light ramp from green to red — Gentle Flight is calm and dignified, not a "worse" color.
- **Retry Sand (`#F3E9DA`)** — the surface behind a "try again" moment. Warm, neutral, explicitly not red. `[ASSUMPTION]` this replaces any error-red in the entire product — there is no red in this palette by design.
- **Border Hairline (`#D8E6F0`)** — the only separator; low-contrast, cool-toned to recede into the sky.

**Contrast targets** (load-bearing, since text legibility now matters without narration): body text ≥ 4.5:1 against its surface — `space-navy` on `sky-day`/`sky-horizon`/`panel-white` all clear this; `ink-secondary` on `panel-white` clears it, on `sky-day` it does not and should only sit on `panel-white`/`sky-horizon`. `display` type (Liftoff only) ≥ 3:1, comfortably met by `space-navy` or white-on-accent combinations.

**Never**: red, in any shade, anywhere. No gray "disabled/failed" treatment that reads as punishment.

## Typography

`[ASSUMPTION]` Platform-native system font throughout (San Francisco / SF Rounded where available) — no custom webfont load, both for performance on a static GitHub Pages install and because a rounded system face already reads as friendly.

- `display` — the Liftoff moment only. Big, bold, rare — reserved for the one climax of the day.
- `heading` — Settings section titles (parent-facing).
- `body` — sized up from a typical adult default; Tiebe reads independently now, but at 7 the margin for legibility should stay generous.
- `numeral` — tabular, bold, largest interactive text in the app — the keypad and direct-digit buttons are the most-touched surface every single day.

No all-caps labels, no letter-spacing tricks — nothing that adds a reading-comprehension tax for a young reader.

**Dynamic Type**: honored throughout — the app scales with the iPadOS system text-size setting rather than fixing pixel sizes, since text legibility is load-bearing now that narration is gone. `[ASSUMPTION]` layout must tolerate at least two steps up from the default without truncating the keypad or fuel-tank labels-that-aren't-there.

## Layout & Spacing

Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48px. `[ASSUMPTION]` the top of that scale (48px) is wider than a typical mobile app's spacing scale on purpose — this is a single-child iPad app meant to be touched by small fingers at arm's length, not a dense information surface.

Single column, single surface at a time — Home, Run, Liftoff, Settings never share the screen. Generous margins on the Run view keep the current Card and keypad the only things competing for attention. Settings is the one screen allowed to be denser (it's for the parent).

## Elevation & Depth

`[ASSUMPTION]` Minimal elevation. The fuel tanks and keypad sit on flat panels distinguished from the sky by color contrast, not drop shadow — shadows are reserved for the rocket itself during the Liftoff animation, where a soft shadow sells the sense of lifting off the pad.

## Shapes

`rounded/lg` (24px) for the fuel tanks and any large celebratory surface — round enough to feel toy-like and safe. `rounded/md` (16px) for keypad keys and cards. `rounded/full` for the rocket's window and any circular progress dot. Nothing sharp-cornered anywhere in Tiebe's view; Settings can use `rounded/sm` (8px) for its denser rows.

## Components

- **Fuel tank (`rr-fuel-tanks`)** — 5 tanks side by side, each a rounded vertical vessel, teal fill rising from the bottom, no numbers or percentage labels anywhere on or near it (side-by-side layout confirmed in `mockups/key-home.html`, resolving the earlier stacked/side-by-side assumption).

  → `mockups/key-home.html` (not-yet-flown / already-flown).
- **Numeric keypad / direct-digit buttons (`rr-keypad`)** — large square `panel-white` keys, bold navy numerals, generous gaps between keys to prevent mis-taps. When the answer is a single digit, the keypad is replaced by a row of big direct-digit buttons rather than the full grid.

  → `mockups/key-run.html` (normal answer / retry-sand states).
- **Liftoff (`rr-liftoff`)** — full-screen moment; rocket silhouette rising against the sky gradient, accent color set by the day's Flight Tier (star-yellow / steady-blue / gentle-lilac). Tiers are also told apart by star count in the sky (3 stars Perfect / 2 Steady / 1 Gentle) so the distinction never rests on color alone. No score, no percentage, no text label rendered anywhere.

  → `mockups/key-liftoff.html` (all three tiers).
- **Run progress (`rr-run-progress`)** — a simple "Run X of Y" bar in `rocket-orange`, shown only when a Daily Session needs more than one Run.
- **Settings row (`rr-settings-row`)** — label/value/chevron pattern, hairline dividers, denser spacing than the play surface; this is the one place the product is allowed to look like a normal settings screen.

  → `mockups/key-settings.html` (list + progress-loss confirmation popup).

## Do's and Don'ts

| Do | Don't |
|---|---|
| One accent (rocket orange) for primary action | Multiple competing bright colors per screen |
| Fuel tank fill as the only progress signal | Numbers, percentages, or scoreboards anywhere in Tiebe's view |
| Three distinct hues for the three Flight Tiers | A red→green traffic-light ramp that makes Gentle Flight read as "failing" |
| Warm, neutral "try again" surface (retry-sand) | Any shade of red, anywhere |
| Generous, rounded, toy-safe shapes for Tiebe's view | Sharp corners or dense information layouts outside Settings |
| Reserve `display` type and shadow for the Liftoff climax | Overusing large/bold type or shadow elsewhere, diluting the moment |
