// rr-fuel-tanks — Custom Element, Shadow DOM, pure render(state). No DB/domain access (AD-1).
class RrFuelTanks extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._state = { boxCounts: [], totalCards: 0 };
  }

  connectedCallback() {
    this.render(this._state);
  }

  render(state) {
    this._state = state ?? this._state;
    const { boxCounts, totalCards } = this._state;

    const tanks = boxCounts
      .map((count) => {
        const percent = totalCards > 0 ? (count / totalCards) * 100 : 0;
        return `<div class="tank"><div class="fill" style="height:${percent}%"></div></div>`;
      })
      .join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .tanks {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: var(--space-3, 0.75rem);
        }
        .tank {
          width: 3.5rem;
          height: 8.75rem;
          border-radius: var(--radius-lg, 1.5rem);
          background: var(--color-border-hairline, #D8E6F0);
          border: 2px solid var(--color-panel-white, #FFFFFF);
          position: relative;
          overflow: hidden;
        }
        .fill {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--color-fuel-teal, #2FD3B0);
          height: 0%;
        }
      </style>
      <div class="tanks">${tanks}</div>
    `;
  }
}

customElements.define('rr-fuel-tanks', RrFuelTanks);
