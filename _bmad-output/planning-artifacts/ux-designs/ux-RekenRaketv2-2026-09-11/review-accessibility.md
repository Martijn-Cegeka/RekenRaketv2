# Accessibility Review — RekenRaketv2

Ad-hoc lens, requested for this kid-facing app despite hobby stakes. Scope: iPad Safari, single seven-year-old reader, no assistive-tech requirement stated in the PRD.

## Findings

- **high** No contrast ratio stated for `ink-secondary` (#4B5A73) on `panel-white`/`sky-horizon`, or `space-navy` (#0B1D3A) on `sky-day` (#CDEBFB). Since narration was dropped, text legibility is now load-bearing for a beginner-independent reader, not a nice-to-have. *Fix:* state and verify a minimum contrast target (recommend ≥4.5:1 for body text, ≥3:1 for large/`display` text).
- **medium** Dynamic Type / iOS text-size setting not addressed — DESIGN.md's `body`/`numeral` typography notes describe a fixed platform-native size rather than an explicit stance on honoring the system text-size setting. *Fix:* state whether RekenRaket honors Dynamic Type or intentionally fixes size (with rationale) in DESIGN.md § Typography.
- **low** Flight Tiers already distinguished by more than color (per Accessibility Floor) — good; no further action.
- **low** Screen-reader labeling and keyboard/Switch Control support remain an open gap, consistent with the Architecture Spine's own note that this "hasn't been raised in the PRD." Not a new gap introduced by this spine pair — informational only, left open per existing scope decision.

## Verdict
Adequate for hobby-stakes v1, with two fixable gaps (contrast target, Dynamic Type stance) worth closing before mocks are built against these tokens.
