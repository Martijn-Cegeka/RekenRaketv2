// App shell: wires store.js + components, owns view switching (currently Home only).
import { createStore } from './store.js';
import './components/rr-fuel-tanks.js';
import './components/rr-run-view.js';
import './components/rr-liftoff.js';
import './components/rr-settings.js';

function mountShell() {
  const fuelTanks = document.createElement('rr-fuel-tanks');
  const startButton = document.createElement('button');
  startButton.type = 'button';
  startButton.id = 'start-practice';
  startButton.textContent = "Start today's practice";
  const runView = document.createElement('rr-run-view');
  const liftoff = document.createElement('rr-liftoff');
  const settings = document.createElement('rr-settings');

  // Only Home (fuel tanks + start button) is active until a session starts.
  runView.hidden = true;
  liftoff.hidden = true;
  settings.hidden = true;

  document.body.append(fuelTanks, startButton, runView, liftoff, settings);

  return { fuelTanks, startButton, runView, liftoff, settings };
}

async function boot() {
  const store = createStore();

  try {
    const state = await store.init();
    const { fuelTanks, startButton, runView } = mountShell();
    fuelTanks.render(state);

    startButton.addEventListener('click', () => {
      store.startSession().catch((err) => console.error('Failed to start session', err));
    });

    store.subscribe((nextState) => {
      fuelTanks.render(nextState);
      runView.render(nextState);

      const sessionActive = nextState.session != null;
      fuelTanks.hidden = sessionActive;
      startButton.hidden = sessionActive;
      runView.hidden = !sessionActive;
    });
  } catch (err) {
    console.error('RekenRaket failed to initialize', err);
  }
}

boot();
