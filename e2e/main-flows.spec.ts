import { API_URL, expect, openTab, test } from './fixtures';

test.describe('Hauptanwendungsfälle', () => {
  test('Heute-Ansicht zeigt die nächsten Gerichte', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Heute' })).toBeVisible();
    await expect(page.locator('#meal-schedule-title')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gekocht' }).first()).toBeVisible();
  });

  test('Navigation über die Tab-Leiste', async ({ page }) => {
    await page.goto('/');
    await openTab(page, 'Pläne');
    await expect(page.getByRole('heading', { level: 1, name: 'Speisepläne' })).toBeVisible();
    await openTab(page, 'Gerichte');
    await expect(page.getByRole('heading', { level: 1, name: 'Gerichte' })).toBeVisible();
    await openTab(page, 'Einkauf');
    await expect(page.getByRole('heading', { level: 1, name: 'Einkaufsliste' })).toBeVisible();
    await openTab(page, 'Heute');
    await expect(page.getByRole('heading', { level: 1, name: 'Heute' })).toBeVisible();
  });

  test('Speiseplan öffnen und Gerichte sehen', async ({ page }) => {
    await page.goto('/#/plans');
    const firstPlan = page.locator('a.plan-row[href*="/plans/"]').first();
    const planName = (await firstPlan.locator('strong').innerText()).trim();
    await firstPlan.click();
    await expect(page.getByRole('heading', { level: 1, name: planName })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Gerichte im Plan' }).locator('.dish-card').first()).toBeVisible();
  });

  test('Gericht suchen und Details öffnen', async ({ page }) => {
    await page.goto('/#/dishes');
    const cards = page.locator('a.dish-card');
    await expect(cards.first()).toBeVisible();
    const dishName = (await cards.first().locator('h2, strong').first().innerText()).trim();

    await page.getByRole('searchbox', { name: 'Suche nach Name' }).fill(dishName.slice(0, 5));
    await expect(cards.first()).toContainText(dishName.slice(0, 5));
    await cards.first().click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Zutaten' })).toBeVisible();
  });

  test('Gericht als gekocht markieren', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Gekocht' }).first().click();
    await expect(page.getByRole('status').filter({ hasText: 'ist als gekocht gespeichert' })).toBeVisible();
  });

  test('Einkaufsliste: ergänzen, abhaken und Einkauf abschließen', async ({ page }, testInfo) => {
    const itemName = `E2E-Milch-${testInfo.project.name}-${Date.now()}`;
    await page.goto('/#/shopping-list');
    await expect(page.getByRole('heading', { level: 1, name: 'Einkaufsliste' })).toBeVisible();

    await page.getByRole('button', { name: 'Für die nächsten Tage ergänzen' }).click();
    await expect(page.getByRole('button', { name: 'Für die nächsten Tage ergänzen' })).toBeEnabled();

    await page.locator('input[name=ingredientName]').fill(itemName);
    await page.locator('input[name=quantity]').fill('2');
    await page.locator('select[name=unit]').selectOption('l');
    await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click();
    await expect(page.getByRole('status')).toContainText(`${itemName} wurde hinzugefügt.`);

    const row = page.locator('li.item-row', { hasText: itemName });
    await row.getByRole('checkbox').check();
    await expect(page.locator('li.item-row.checked', { hasText: itemName })).toBeVisible();

    await page.getByRole('button', { name: 'Einkauf abschließen' }).click();
    await expect(page.getByRole('status')).toContainText('in den Vorratsschrank gebucht');

    await page.goto('/#/pantry');
    await expect(page.getByRole('heading', { level: 1, name: 'Vorratsschrank' })).toBeVisible();
    await expect(page.getByText(itemName)).toBeVisible();
  });

  test('Schnellmenü führt zu Einstellungen und Vorratsschrank', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Hinzufügen und weitere Bereiche' }).click();
    await page.getByRole('menuitem', { name: /Einstellungen/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Einstellungen' })).toBeVisible();

    await page.getByRole('button', { name: 'Hinzufügen und weitere Bereiche' }).click();
    await page.getByRole('menuitem', { name: /Vorratsschrank/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Vorratsschrank' })).toBeVisible();
  });

  test('Kosten: Anzeige einschalten, Beleg manuell erfassen, Übersicht zeigt Ausgaben', async ({ page }) => {
    await page.goto('/#/settings');
    const toggle = page.locator('#costTrackingEnabled');
    await expect(toggle).toBeVisible();
    await toggle.check();
    await page.locator('#weeklyBudgetEur').fill('100');
    await page.getByRole('button', { name: 'Speichern', exact: true }).click();
    await expect(page.getByText('Profil gespeichert.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Haushalt' })).toBeVisible();

    await page.goto('/#/receipts');
    await expect(page.getByRole('heading', { level: 1, name: 'Belege & Ausgaben' })).toBeVisible();
    await page.getByTestId('receipt-total').fill('12.34');
    await page.locator('input[name=store]').fill('E2E-Markt');
    await page.getByRole('button', { name: 'Ausgabe speichern' }).click();
    await expect(page.locator('.receipt-list li', { hasText: 'E2E-Markt' }).first()).toContainText(/12[.,]34/);

    await page.goto('/');
    await expect(page.getByTestId('cost-card')).toContainText('Ausgaben diese Woche');
  });

  test('Vorrat: Ablaufdatum setzen, bald ablaufende Zutaten werden hervorgehoben', async ({ page, request }) => {
    const isoDate = (offset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    const name = `E2E-Ablauf-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const created = await request.post(`${API_URL}/pantry/batches`, {
      data: { items: [{ ingredientName: name, quantity: 1, unit: 'Stk.', expiresOn: isoDate(1) }] },
    });
    expect(created.ok()).toBeTruthy();
    const [item] = await created.json();

    try {
      await page.goto('/#/pantry');
      await expect(page.getByTestId('use-soon')).toContainText(name);
      const row = page.locator('.item-list li', { hasText: name });
      await expect(row).toContainText('Läuft morgen ab');
      await row.locator('input[type=date]').fill(isoDate(10));
      await expect(row).toContainText('Noch 10 Tage haltbar');
      await expect(page.getByTestId('use-soon').filter({ hasText: name })).toHaveCount(0);
    } finally {
      await request.delete(`${API_URL}/pantry/${item.id}`);
    }
  });

  test('Nährwerte: Wochenübersicht erscheint bei aktivierter Nährwert-Anzeige', async ({ page }) => {
    await page.goto('/#/settings');
    const toggle = page.locator('#nutritionTrackingEnabled');
    await expect(toggle).toBeVisible();
    await toggle.check();
    await page.getByRole('button', { name: 'Speichern', exact: true }).click();
    await expect(page.getByText('Profil gespeichert.')).toBeVisible();

    await page.goto('/');
    const week = page.getByTestId('week-nutrition');
    await expect(week).toContainText('Diese Woche');
    await expect(week.locator('.bar')).toHaveCount(7);
  });
});
