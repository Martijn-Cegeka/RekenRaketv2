# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-project-foundation-home-with-empty-fuel-tanks.md`
  summary: Add real home-screen install icon assets (`manifest.webmanifest` icons, `apple-touch-icon`, `apple-mobile-web-app-capable` meta tags).
  evidence: No icon asset file exists anywhere in the repo yet; requires a design asset outside a code-only build session. NFR-1/NFR-3 call for home-screen install support, currently limited to a blank/default icon.

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-project-foundation-home-with-empty-fuel-tanks.md`
  summary: Add ARIA roles/labels and other screen-reader affordances to `rr-fuel-tanks` (and later components).
  evidence: Architecture Spine's own Deferred section explicitly lists "Accessibility specifics (contrast, focus order, screen-reader labeling)... worth a pass once components exist" as out of scope until components exist.
