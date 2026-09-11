// rr-run-view — Custom Element, Shadow DOM, pure render(state). No DB/domain access (AD-1).
// Renders the current run's card count and, only when there's more than one run,
// an inline rr-run-progress fragment ("Run X of Y") per AD-7. Keypad lands in Story 1.3.
class RrRunView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = { session: null };
  }

  connectedCallback() {
    this.render(this._state);
  }

  render(state) {
    this._state = state ?? this._state;
    const { session } = this._state;

    if (!session) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    const { runs, currentRunIndex } = session;
    const currentRun = runs[currentRunIndex] ?? [];

    const progress =
      runs.length > 1 && currentRunIndex < runs.length
        ? `<div class="rr-run-progress">Run ${currentRunIndex + 1} of ${runs.length}</div>`
        : '';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .rr-run-progress {
          color: var(--color-rocket-orange, #FF7A3D);
          font-weight: bold;
        }
      </style>
      ${progress}
      <div class="run-card-count">${currentRun.length}</div>
    `;
  }
}

customElements.define('rr-run-view', RrRunView);
