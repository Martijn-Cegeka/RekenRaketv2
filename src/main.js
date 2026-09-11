// App shell: wires store.js + components, owns view switching (currently Home only).
import { createStore } from './store.js';
import './components/rr-fuel-tanks.js';
import './components/rr-run-view.js';
import './components/rr-liftoff.js';
import './components/rr-settings.js';

function mountShell() {
  const fuelTanks = document.createElement('rr-fuel-tanks');
  const runView = document.createElement('rr-run-view');
  const liftoff = document.createElement('rr-liftoff');
  const settings = document.createElement('rr-settings');

  // Only Home (fuel tanks) is active in this story; other screens are inactive stubs.
  runView.hidden = true;
  liftoff.hidden = true;
  settings.hidden = true;

  document.body.append(fuelTanks, runView, liftoff, settings);

  return { fuelTanks, runView, liftoff, settings };
}

async function boot() {
  const store = createStore();

  try {
    const state = await store.init();
    const { fuelTanks } = mountShell();
    fuelTanks.render(state);
    store.subscribe((nextState) => fuelTanks.render(nextState));
  } catch (err) {
    console.error('RekenRaket failed to initialize', err);
  }
}

boot();
