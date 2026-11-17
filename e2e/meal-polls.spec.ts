import { expect, test } from '@playwright/test';
import type { ManagedMealPoll, PublicMealPoll } from '../src/app/core/meal-poll-api.service';

const poll: PublicMealPoll = {
  id: 'public-poll-id',
  createdAt: '2026-11-17T10:00:00Z',
  expiresAt: '2026-11-22T10:00:00Z',
  closed: false,
  options: [
    { entryId: 1, dishId: 11, name: 'Nudeln', imageUrl: '/assets/test-dish.svg', mealSlot: 'DINNER' },
    { entryId: 2, dishId: 12, name: 'Suppe', imageUrl: '/assets/test-dish.svg', mealSlot: 'DINNER' },
    { entryId: 3, dishId: 13, name: 'Salat', imageUrl: '/assets/test-dish.svg', mealSlot: 'LUNCH' },
  ],
};

function managed(): ManagedMealPoll {
  return {
    poll: structuredClone(poll), voteCount: 2,
    results: [
      { option: poll.options[1], averageRank: 1.5 },
      { option: poll.options[2], averageRank: 2 },
      { option: poll.options[0], averageRank: 2.5 },
    ],
    votes: [{ name: 'Anna', ranking: [2, 3, 1] }, { name: 'Ben', ranking: [3, 2, 1] }],
  };
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/**', (route) => route.fulfill({ json: [] }));
  await page.route('**/api/auth/me', (route) => route.fulfill({ status: 401, json: { message: 'Nicht angemeldet' } }));
  await page.route('**/assets/test-dish.svg', (route) => route.fulfill({
    contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect width="50" height="50" fill="green"/></svg>',
  }));
  await page.route('**/api/public/meal-polls/public-poll-id', (route) => route.fulfill({ json: poll }));
});

test('public voting needs no login, hides onboarding, and allows named ranking correction', async ({ page }) => {
  const ballots: unknown[] = [];
  await page.route('**/api/public/meal-polls/public-poll-id/votes', async (route) => {
    ballots.push(route.request().postDataJSON());
    await route.fulfill({ status: 204 });
  });
  await page.goto('/#/vote/public-poll-id');
  await expect(page.getByRole('heading', { name: 'Deine Wunschreihenfolge' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toHaveCount(0);
  await expect(page.locator('app-onboarding-tour')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Rangliste absenden' })).toBeDisabled();
  await page.getByRole('button', { name: 'Salat nach oben' }).click();
  await page.getByRole('button', { name: 'Salat nach oben' }).click();
  await page.getByRole('textbox', { name: 'Dein Name' }).fill('Anna');
  await page.getByRole('button', { name: 'Rangliste absenden' }).click();
  await expect(page.getByRole('status')).toContainText('Danke, Anna');
  expect(ballots).toEqual([{ name: 'Anna', ranking: [3, 1, 2] }]);
  await page.getByRole('button', { name: 'Meine Stimme ändern' }).click();
  await page.getByRole('button', { name: 'Suppe nach oben' }).click();
  await page.getByRole('button', { name: 'Rangliste absenden' }).click();
  expect(ballots[1]).toEqual({ name: 'Anna', ranking: [3, 2, 1] });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('rankings can be sorted using actual mouse or mobile touch dragging', async ({ page, context }, testInfo) => {
  await page.goto('/#/vote/public-poll-id');
  const handle = page.getByRole('button', { name: 'Suppe ziehen' });
  await handle.scrollIntoViewIfNeeded();
  const start = await handle.boundingBox();
  const target = await page.getByRole('button', { name: 'Nudeln ziehen' }).boundingBox();
  if (!start || !target) {
    throw new Error('Drag handles are not visible');
  }
  const x = start.x + start.width / 2;
  const from = start.y + start.height / 2;
  const to = target.y + target.height / 2 - 10;
  if (testInfo.project.name === 'mobile') {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: from }] });
    await page.waitForTimeout(220);
    for (let step = 1; step <= 12; step++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: from + (to - from) * step / 12 }] });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await cdp.detach();
  } else {
    await page.mouse.move(x, from);
    await page.mouse.down();
    await page.mouse.move(x, from - 8, { steps: 3 });
    await page.mouse.move(x, to, { steps: 12 });
    await page.mouse.up();
  }
  await expect(page.getByRole('list', { name: 'Deine Rangliste' }).getByRole('listitem').first()).toContainText('Suppe');
});

test('creator can create, share the public link, see results and apply a variable top count', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('speiseplan_onboarding_completed', 'true'));
  await page.route('**/api/auth/me', (route) => route.fulfill({
    json: { name: 'Roman', firstName: 'Roman', lastName: '', email: 'roman@example.com', pictureUrl: null },
  }));
  const current = managed();
  let created = false;
  let applied: unknown;
  await page.route('**/api/meal-polls', async (route) => {
    if (route.request().method() === 'POST') {
      created = true;
      await route.fulfill({ status: 201, json: current });
    } else {
      await route.fulfill({ json: created ? [current] : [] });
    }
  });
  await page.route('**/api/meal-polls/public-poll-id/apply', async (route) => {
    applied = route.request().postDataJSON();
    current.poll.closed = true;
    await route.fulfill({ json: current });
  });
  await page.goto('/#/meal-polls');
  await page.getByRole('button', { name: 'Hinzufügen und weitere Bereiche' }).click();
  await page.getByRole('menuitem', { name: 'Familienabfrage erstellen' }).click();
  await page.getByRole('button', { name: 'Neue Abfrage erstellen' }).click();
  await expect(page.getByRole('textbox', { name: 'Öffentlicher Abstimmungslink' })).toHaveValue(/#\/vote\/public-poll-id$/);
  const whatsapp = await page.getByRole('link', { name: 'Per WhatsApp teilen' }).getAttribute('href');
  expect(decodeURIComponent(whatsapp ?? '')).toContain('#/vote/public-poll-id');
  await expect(page.getByRole('heading', { name: 'Ergebnisse · 2 Stimmen' })).toBeVisible();
  await expect(page.locator('.results li').first()).toContainText('Suppe');
  await expect(page.locator('.results li').first()).toContainText('1.50');
  await page.getByText('Anna', { exact: true }).click();
  await expect(page.locator('details[open] ol li').first()).toHaveText('Suppe');
  await page.getByRole('combobox', { name: 'Anzahl Top-Gerichte' }).selectOption({ label: 'Top 2' });
  await page.getByRole('button', { name: 'Top 2 als Nächstes ansetzen' }).click();
  expect(applied).toEqual({ count: 2 });
  await expect(page.getByRole('status')).toContainText('Top 2 sind jetzt');
  await expect(page.getByRole('heading', { name: 'Beendete Abfrage' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('closed polls stay readable without a voting form; expired polls show an explicit error', async ({ page }) => {
  await page.route('**/api/public/meal-polls/public-poll-id', (route) => route.fulfill({ json: { ...poll, closed: true } }));
  await page.goto('/#/vote/public-poll-id');
  await expect(page.getByRole('status')).toContainText('beendet');
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Rangliste absenden' })).toHaveCount(0);
  await page.route('**/api/public/meal-polls/public-poll-id', (route) => route.fulfill({
    status: 404, json: { message: 'Abfrage nicht gefunden oder nach fünf Tagen abgelaufen.' },
  }));
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('abgelaufen');
  await expect(page.getByRole('listitem')).toHaveCount(0);
});

test('failed submission retains the ordered list and name', async ({ page }) => {
  await page.route('**/api/public/meal-polls/public-poll-id/votes', (route) => route.fulfill({
    status: 400, json: { message: 'Die Abfrage ist nicht mehr verfügbar.' },
  }));
  await page.goto('/#/vote/public-poll-id');
  await page.getByRole('button', { name: 'Suppe nach oben' }).click();
  await page.getByRole('textbox', { name: 'Dein Name' }).fill('Anna');
  await page.getByRole('button', { name: 'Rangliste absenden' }).click();
  await expect(page.getByRole('alert')).toContainText('nicht mehr verfügbar');
  await expect(page.getByRole('textbox', { name: 'Dein Name' })).toHaveValue('Anna');
  await expect(page.getByRole('listitem').first()).toContainText('Suppe');
});

test('creating and managing polls requires sign-in', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('speiseplan_onboarding_completed', 'true'));
  await page.goto('/#/meal-polls');
  await expect(page).toHaveURL(/#\/login$/);
  await expect(page.getByRole('button', { name: 'Neue Abfrage erstellen' })).toHaveCount(0);
});
