# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-project-foundation-home-with-empty-fuel-tanks.md`
  summary: Add real home-screen install icon assets (`manifest.webmanifest` icons, `apple-touch-icon`, `apple-mobile-web-app-capable` meta tags).
  evidence: No icon asset file exists anywhere in the repo yet; requires a design asset outside a code-only build session. NFR-1/NFR-3 call for home-screen install support, currently limited to a blank/default icon.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-project-foundation-home-with-empty-fuel-tanks.md`
  summary: Add ARIA roles/labels and other screen-reader affordances to `rr-fuel-tanks` (and later components).
  evidence: Architecture Spine's own Deferred section explicitly lists "Accessibility specifics (contrast, focus order, screen-reader labeling)... worth a pass once components exist" as out of scope until components exist.

## Deferred from: code review (2026-09-11)

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-due-card-computation-run-batching.md`
  summary: Numeric run count + English UI copy violate DESIGN.md ("no numbers ever") and EXPERIENCE.md ("Dutch throughout"); should use the approved static Dutch phrase "Nog een rondje te gaan." instead of "Run X of Y", drop `.run-card-count`, and translate the start-practice button.
  evidence: was wrongly specced

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-due-card-computation-run-batching.md`
  summary: Session completion (`isComplete`) has no UI transition — `rr-run-view`/`main.js` stay stuck showing a 0-card run view once the last run completes.
  evidence: Real, verified — `runs[currentRunIndex]` becomes `undefined` once `isComplete` is true, and `main.js`'s `sessionActive` check never turns false again. Out of scope until Story 1.5 (Liftoff) per spec-1-2's own "Never" boundary.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-due-card-computation-run-batching.md`
  summary: Add ARIA roles/labels and focus management for the Home→Run transition (`rr-run-view`, `#start-practice`).
  evidence: Consistent with Story 1.1's own deferred accessibility precedent; no `aria-live` region or focus handling exists yet for the new view-switching behavior.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-2-due-card-computation-run-batching.md`
  summary: Apply the `:host([hidden]) { display: none; }` CSS fix to `rr-liftoff`/`rr-settings` once their `render()` methods are implemented.
  evidence: `rr-fuel-tanks`/`rr-run-view` needed this fix in Story 1.2 (see its Implementation Notes); the remaining two components are still empty stubs with no `:host` style, so no override exists yet — but the same bug will recur once they gain one.
