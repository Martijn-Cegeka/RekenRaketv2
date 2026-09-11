// rr-settings — structural seed stub only (Story 1.6). Renders settings rows
// internally per AD-7 once implemented; not active in this story.
class RrSettings extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  render() {
    // Not implemented until Story 1.6.
  }
}

customElements.define('rr-settings', RrSettings);
