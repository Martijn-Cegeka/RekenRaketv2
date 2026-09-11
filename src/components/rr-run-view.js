// rr-run-view — structural seed stub only (Story 1.2+). Renders keypad + run-progress
// internally per AD-7 once implemented; not active in this story.
class RrRunView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  render() {
    // Not implemented until Story 1.2.
  }
}

customElements.define('rr-run-view', RrRunView);
