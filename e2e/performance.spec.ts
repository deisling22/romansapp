import { Page } from '@playwright/test';
import { API_URL, countRequests, expect, openTab, tabLink, test } from './fixtures';

/**
 * Performance- und Robustheitstests.
 * Grenzwerte orientieren sich an den Core Web Vitals (LCP <= 2,5 s, CLS <= 0,1, INP <= 200 ms),
 * an Touch-Zielen von mindestens 44 px (Apple HIG / WCAG 2.5.5) und daran, dass hektisches
 * Mehrfachklicken genau eine schreibende Anfrage auslöst.
 */

const ROUTES = [
  { path: '/', heading: 'Heute' },
  { path: '/#/plans', heading: 'Speisepläne' },
  { path: '/#/dishes', heading: 'Gerichte' },
  { path: '/#/shopping-list', heading: 'Einkaufsliste' },
];

async function collectWebVitals(page: Page): Promise<{ lcp: number; cls: number }> {
  return page.evaluate(
    () =>
      new Promise<{ lcp: number; cls: number }>((resolve) => {
        let lcp = 0;
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            lcp = Math.max(lcp, entry.startTime);
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
            if (!entry.hadRecentInput) {
              cls += entry.value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve({ lcp, cls }), 500);
      }),
  );
}

/** Rapidly fires `times` click events on the element, like an impatient user. */
async function hammer(page: Page, selector: ReturnType<Page['locator']>, times: number): Promise<void> {
  await selector.evaluate((element, count) => {
    for (let index = 0; index < count; index++) {
      (element as HTMLElement).click();
    }
  }, times);
}

test.describe('Ladezeiten und Layout', () => {
  for (const route of ROUTES) {
    test(`${route.heading}: LCP, CLS und kein horizontales Scrollen`, async ({ page }) => {
      const start = Date.now();
      await page.goto(route.path);
      await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
      const visibleAfter = Date.now() - start;

      const vitals = await collectWebVitals(page);
      expect(visibleAfter, 'Inhalt sichtbar').toBeLessThan(3000);
      expect(vitals.lcp, 'Largest Contentful Paint').toBeLessThan(2500);
      expect(vitals.cls, 'Cumulative Layout Shift').toBeLessThan(0.1);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'horizontaler Überlauf in px').toBeLessThanOrEqual(0);
    });
  }

  test('Tab-Leiste hat ausreichend große Touch-Ziele', async ({ page }) => {
    await page.goto('/');
    for (const name of ['Heute', 'Pläne', 'Gerichte', 'Einkauf'] as const) {
      const box = await tabLink(page, name).boundingBox();
      expect(box, name).not.toBeNull();
      expect(box!.height, `${name} Höhe`).toBeGreaterThanOrEqual(44);
      expect(box!.width, `${name} Breite`).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Reaktionsfähigkeit bei schnellem Klicken', () => {
  test('Schneller Tab-Wechsel bleibt flüssig (INP)', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Heute' })).toBeVisible();
    await page.evaluate(() => {
      (window as unknown as { __maxEvent: number }).__maxEvent = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const store = window as unknown as { __maxEvent: number };
          store.__maxEvent = Math.max(store.__maxEvent, entry.duration);
        }
      }).observe({ type: 'event', buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
    });

    const tabs = ['Pläne', 'Gerichte', 'Einkauf', 'Heute'] as const;
    for (let round = 0; round < 5; round++) {
      for (const tab of tabs) {
        await openTab(page, tab);
      }
    }
    await expect(page.getByRole('heading', { level: 1, name: 'Heute' })).toBeVisible({ timeout: 2000 });
    const maxEventDuration = await page.evaluate(() => (window as unknown as { __maxEvent: number }).__maxEvent);
    expect(maxEventDuration, 'längste Interaktion in ms').toBeLessThan(200);
  });

  test('"Gekocht" mehrfach angetippt löst genau eine Buchung aus', async ({ page, apiRequests }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Gekocht' }).first();
    await expect(button).toBeVisible();
    await hammer(page, button, 10);
    await expect(page.getByRole('status').filter({ hasText: 'ist als gekocht gespeichert' })).toBeVisible();
    expect(countRequests(apiRequests, 'PATCH', /\/plan-entries\/\d+\/cook$/)).toBe(1);
  });

  test('"Später" mehrfach angetippt verschiebt nur einmal', async ({ page, apiRequests }) => {
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Später' }).first();
    await expect(button).toBeVisible();
    await hammer(page, button, 10);
    await expect(page.getByRole('status').filter({ hasText: 'nach hinten verschoben' })).toBeVisible();
    expect(countRequests(apiRequests, 'POST', /\/plan-entries\/\d+\/skip$/)).toBe(1);
  });

  test('Einkaufsliste ergänzen mehrfach angetippt erzeugt eine Anfrage', async ({ page, apiRequests }) => {
    await page.goto('/#/shopping-list');
    const button = page.getByRole('button', { name: 'Für die nächsten Tage ergänzen' });
    await expect(button).toBeEnabled();
    await hammer(page, button, 10);
    await expect(button).toBeEnabled();
    expect(countRequests(apiRequests, 'POST', /\/schedule\/shopping-list/)).toBe(1);
  });

  test('Abhaken mehrfach hintereinander sendet nur den Endzustand', async ({ page, apiRequests }, testInfo) => {
    const itemName = `E2E-Toggle-${testInfo.project.name}-${Date.now()}`;
    await page.goto('/#/shopping-list');
    await page.locator('input[name=ingredientName]').fill(itemName);
    await page.locator('input[name=quantity]').fill('1');
    await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click();
    const checkbox = page.locator('li.item-row', { hasText: itemName }).getByRole('checkbox');
    await expect(checkbox).toBeVisible();

    await hammer(page, checkbox, 5);
    await expect(page.locator('li.item-row.checked', { hasText: itemName })).toBeVisible();
    await page.waitForTimeout(800);
    expect(countRequests(apiRequests, 'PATCH', /\/shopping-list\/\d+$/)).toBeLessThanOrEqual(1);
  });

  test('Suche schickt beim Tippen nicht pro Taste eine Anfrage', async ({ page, apiRequests }) => {
    await page.goto('/#/dishes');
    await expect(page.locator('a.dish-card').first()).toBeVisible();
    const before = countRequests(apiRequests, 'GET', /\/dishes(\?|$)/);
    await page.getByRole('searchbox', { name: 'Suche nach Name' }).pressSequentially('Nudelauflauf', { delay: 40 });
    await page.waitForTimeout(600);
    const searches = countRequests(apiRequests, 'GET', /\/dishes(\?|$)/) - before;
    expect(searches).toBeGreaterThanOrEqual(1);
    expect(searches).toBeLessThanOrEqual(2);
  });
});

test.describe('Backend unter Last', () => {
  test('Parallele Schreibzugriffe führen nicht zu Serverfehlern', async ({ request }) => {
    const schedule = await (await request.get(`${API_URL}/schedule`)).json();
    const entryIds: number[] = schedule.days
      .flatMap((day: { meals: { planEntryId: number | null }[] }) => day.meals)
      .map((meal: { planEntryId: number | null }) => meal.planEntryId)
      .filter((id: number | null): id is number => id !== null)
      .slice(0, 3);
    expect(entryIds.length).toBeGreaterThan(0);

    const calls = [];
    for (let index = 0; index < 15; index++) {
      const entryId = entryIds[index % entryIds.length];
      calls.push(request.post(`${API_URL}/plan-entries/${entryId}/missing-to-shopping-list`, { data: {} }));
      calls.push(request.post(`${API_URL}/schedule/shopping-list`, { data: {} }));
      calls.push(request.post(`${API_URL}/shopping-list`, { data: { ingredientName: 'Lasttest', quantity: 1, unit: 'Stk.' } }));
      calls.push(request.get(`${API_URL}/shopping-list`));
    }
    const statuses = (await Promise.all(calls)).map((response) => response.status());
    expect(statuses.filter((status) => status >= 500), `Statuscodes: ${statuses.join(',')}`).toEqual([]);

    const start = Date.now();
    const health = await request.get(`${API_URL}/schedule`);
    expect(health.ok()).toBeTruthy();
    expect(Date.now() - start, 'Antwortzeit nach Last in ms').toBeLessThan(1000);
  });

  test('Viele parallele Lesezugriffe bleiben schnell', async ({ request }) => {
    const start = Date.now();
    const responses = await Promise.all(Array.from({ length: 100 }, () => request.get(`${API_URL}/schedule`)));
    const elapsed = Date.now() - start;
    expect(responses.every((response) => response.ok())).toBeTruthy();
    expect(elapsed, '100 parallele Anfragen in ms').toBeLessThan(5000);
  });
});
