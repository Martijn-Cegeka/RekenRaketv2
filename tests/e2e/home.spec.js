import { test, expect } from '@playwright/test';

test('Home renders 5 fuel tanks on load, visible without starting a session', async ({ page }) => {
  await page.goto('/index.html');

  const fuelTanks = page.locator('rr-fuel-tanks');
  await expect(fuelTanks).toBeAttached();

  await expect
    .poll(() => fuelTanks.evaluate((el) => el.shadowRoot.querySelectorAll('.tank').length))
    .toBe(5);
});

test('Home fuel tanks reflect the default deck: Box 1 full, Boxes 2-5 empty', async ({ page }) => {
  await page.goto('/index.html');

  const fuelTanks = page.locator('rr-fuel-tanks');
  await expect
    .poll(() =>
      fuelTanks.evaluate((el) =>
        Array.from(el.shadowRoot.querySelectorAll('.tank .fill')).map((fill) => fill.style.height),
      ),
    )
    .toEqual(['100%', '0%', '0%', '0%', '0%']);
});

test('Starting practice on a fresh (4-card) deck shows rr-run-view with no "Run X of Y" indicator', async ({
  page,
}) => {
  await page.goto('/index.html');

  await page.locator('#start-practice').click();

  const runView = page.locator('rr-run-view');
  await expect(runView).toBeVisible();
  await expect(page.locator('rr-fuel-tanks')).toBeHidden();

  const progressCount = await runView.evaluate(
    (el) => el.shadowRoot.querySelectorAll('.rr-run-progress').length,
  );
  expect(progressCount).toBe(0);

  const cardCount = await runView.evaluate(
    (el) => el.shadowRoot.querySelector('.run-card-count').textContent,
  );
  expect(cardCount).toBe('4');
});

test('Starting practice with more than 20 due cards shows "Run 1 of 2" and hides it once each run completes in range', async ({
  page,
}) => {
  await page.goto('/index.html');

  const fuelTanks = page.locator('rr-fuel-tanks');
  await expect
    .poll(() => fuelTanks.evaluate((el) => el.shadowRoot.querySelectorAll('.tank').length))
    .toBe(5);

  // Seed 17 extra cards directly (default deck already has 4) so the due set totals 21.
  await page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const request = indexedDB.open('rekenraket', 1);
        request.onsuccess = () => {
          const db = request.result;
          const tx = db.transaction('cards', 'readwrite');
          const store = tx.objectStore('cards');
          for (let i = 0; i < 17; i += 1) {
            store.put({ id: `subtraction:${i + 5}:${i + 1}`, box: 1 });
          }
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
      }),
  );

  await page.locator('#start-practice').click();

  const runView = page.locator('rr-run-view');
  await expect(runView).toBeVisible();

  const progressText = await runView.evaluate(
    (el) => el.shadowRoot.querySelector('.rr-run-progress')?.textContent,
  );
  expect(progressText).toBe('Run 1 of 2');

  const cardCount = await runView.evaluate(
    (el) => el.shadowRoot.querySelector('.run-card-count').textContent,
  );
  expect(cardCount).toBe('20');
});
