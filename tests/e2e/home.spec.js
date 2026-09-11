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
