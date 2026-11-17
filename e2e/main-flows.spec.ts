import { test as baseTest } from '@playwright/test';
import { API_URL, expect, openTab, test } from './fixtures';

test.describe('Hauptanwendungsfälle', () => {
  test('Heute-Ansicht zeigt die nächsten Gerichte', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Heute' })).toBeVisible();
    await expect(page.locator('#meal-schedule-title')).toBeVisible();
    // One primary action per meal; everything else sits behind "Mehr"
    const firstCard = page.locator('article.meal-card:not(.done)').first();
    await expect(firstCard.getByRole('link', { name: 'Jetzt kochen' })).toBeVisible();
    await expect(firstCard.getByRole('button', { name: /Weitere Aktionen/ })).toBeVisible();
    await expect(firstCard.getByRole('button', { name: 'Als gekocht markieren' })).toHaveCount(0);
  });

  test('Heute zeigt zuerst den Plan, dann die Zahlen', async ({ page }) => {
    await page.goto('/');
    const schedule = page.locator('#meal-schedule-title');
    const figures = page.locator('#figures-title');
    await expect(schedule).toBeVisible();
    await expect(figures).toBeVisible();
    const scheduleTop = (await schedule.boundingBox())!.y;
    const figuresTop = (await figures.boundingBox())!.y;
    expect(scheduleTop).toBeLessThan(figuresTop);
  });

  test('Navigation über die Tab-Leiste', async ({ page }) => {
    await page.goto('/');
    await openTab(page, 'Pläne');
    await expect(page.getByRole('heading', { level: 1, name: 'Speisepläne' })).toBeVisible();
    await openTab(page, 'Gerichte');
    await expect(page.getByRole('heading', { level: 1, name: 'Gerichte' })).toBeVisible();
    await openTab(page, 'Einkauf');
    await expect(page.getByRole('heading', { level: 1, name: 'Einkaufsliste' })).toBeVisible();
    await openTab(page, 'Vorrat');
    await expect(page.getByRole('heading', { level: 1, name: 'Vorratsschrank' })).toBeVisible();
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
    const card = page.locator('article.meal-card:not(.done)').first();
    await card.getByRole('button', { name: /Weitere Aktionen/ }).click();
    await card.getByRole('button', { name: 'Als gekocht markieren' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'ist als gekocht gespeichert' })).toBeVisible();
  });

  test('Jetzt kochen: Kochmodus endet mit „gekocht“ und passt den Vorrat an', async ({ page, request }) => {
    const dishes: { id: number }[] = await (await request.get(`${API_URL}/dishes`)).json();
    let dishId = 0;
    for (const dish of dishes) {
      const detail = await (await request.get(`${API_URL}/dishes/${dish.id}`)).json();
      if (detail.steps.length > 0 && detail.ingredients.length > 0) {
        dishId = dish.id;
        break;
      }
    }
    expect(dishId, 'Gericht mit Schritten und Zutaten').toBeGreaterThan(0);

    await page.goto(`/#/dishes/${dishId}?cook=1`);
    const cookingMode = page.getByRole('dialog');
    await expect(cookingMode).toBeVisible();
    while (await cookingMode.getByRole('button', { name: 'Weiter' }).isVisible()) {
      await cookingMode.getByRole('button', { name: 'Weiter' }).click();
    }
    const cooked = page.waitForResponse((response) => /\/dishes\/\d+\/cook$/.test(response.url()));
    await cookingMode.getByRole('button', { name: 'Fertig – gekocht' }).click();
    expect((await cooked).ok()).toBeTruthy();
    await expect(cookingMode).toBeHidden();
    await expect(page.getByRole('status').filter({ hasText: 'ist als gekocht gespeichert' })).toBeVisible();
  });

  test('Katalog-Gericht in einen Plan übernehmen', async ({ page, request }) => {
    const created = await request.post(`${API_URL}/plans`, { data: { name: `E2E-Plan-${Date.now()}` } });
    const plan = await created.json();
    try {
      await page.goto(`/#/plans/${plan.id}`);
      await page.getByRole('link', { name: 'Aus Gerichten wählen' }).click();
      await expect(page.getByText('Zum Plan hinzufügen')).toBeVisible();
      const card = page.locator('a.dish-card').first();
      const dishName = (await card.locator('h2').innerText()).trim();
      await card.click();
      await expect(page.locator('#planSelect')).toHaveValue(new RegExp(`${plan.id}$`));
      await page.locator('.plan-picker').getByRole('button', { name: 'Hinzufügen' }).click();
      await expect(page.getByRole('status').filter({ hasText: plan.name })).toBeVisible();

      await page.goto(`/#/plans/${plan.id}`);
      await expect(page.getByRole('region', { name: 'Gerichte im Plan' })).toContainText(dishName);
    } finally {
      await request.delete(`${API_URL}/plans/${plan.id}`);
    }
  });

  test('Einkaufsliste: ergänzen, abhaken und Einkauf abschließen', async ({ page }, testInfo) => {
    const itemName = `E2E-Milch-${testInfo.project.name}-${Date.now()}`;
    await page.goto('/#/shopping-list');
    await expect(page.getByRole('heading', { level: 1, name: 'Einkaufsliste' })).toBeVisible();

    await page.getByRole('button', { name: 'Für die nächsten Tage ergänzen' }).click();
    await expect(page.getByRole('button', { name: 'Für die nächsten Tage ergänzen' })).toBeEnabled();

    // One field understands quantity, unit and name
    await page.locator('#quickAdd').fill(`2 l ${itemName}`);
    await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click();
    await expect(page.getByRole('status')).toContainText(`${itemName} wurde hinzugefügt.`);

    const row = page.locator('li.item-row', { hasText: itemName });
    await expect(row).toContainText('2 l');
    await expect(page.getByRole('region', { name: 'Kühlregal' })).toContainText(itemName);
    await row.getByRole('checkbox').check();
    await expect(page.locator('li.item-row.checked', { hasText: itemName })).toBeVisible();

    // Leaving the list must not book anything; only the explicit button does.
    await openTab(page, 'Heute');
    await openTab(page, 'Einkauf');
    await expect(page.locator('li.item-row.checked', { hasText: itemName })).toBeVisible();

    await page.getByRole('button', { name: /Einkauf abschließen/ }).click();
    await expect(page.getByRole('status')).toContainText('in den Vorratsschrank gebucht');
    await expect(page.locator('li.item-row', { hasText: itemName })).toHaveCount(0);

    await openTab(page, 'Vorrat');
    await expect(page.getByRole('heading', { level: 1, name: 'Vorratsschrank' })).toBeVisible();
    await expect(page.locator('.item-list li', { hasText: itemName })).toBeVisible();
  });

  test('Schnellmenü führt zu Einstellungen, Vorrat ist ein eigener Tab', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Hinzufügen und weitere Bereiche' }).click();
    await page.getByRole('menuitem', { name: /Einstellungen/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Einstellungen' })).toBeVisible();

    await openTab(page, 'Vorrat');
    await expect(page.getByRole('heading', { level: 1, name: 'Vorratsschrank' })).toBeVisible();
  });

  test('Vorrat: von Hand ergänzen, Menge korrigieren, als weggeworfen vermerken', async ({ page }, testInfo) => {
    const name = `E2E-Vorrat-${testInfo.project.name}-${Date.now()}`;
    await page.goto('/#/pantry');
    await page.locator('#pantryAdd').fill(`${name} 500 g`);
    await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click();
    const row = page.locator('.item-list li', { hasText: name });
    await expect(row).toBeVisible();
    const quantity = row.getByRole('spinbutton');
    await expect(quantity).toHaveValue('500');

    const saved = page.waitForResponse((response) => /\/pantry\/\d+\/quantity$/.test(response.url()));
    await quantity.fill('200');
    await quantity.blur();
    expect((await saved).ok()).toBeTruthy();
    await page.reload();
    await expect(page.locator('.item-list li', { hasText: name }).getByRole('spinbutton')).toHaveValue('200');

    await page.locator('.item-list li', { hasText: name }).getByRole('button', { name: /weggeworfen/ }).click();
    await expect(page.locator('.item-list li', { hasText: name })).toHaveCount(0);
    await expect(page.getByRole('status').filter({ hasText: 'als weggeworfen vermerkt' })).toBeVisible();
  });

  test('Bald ablaufend: Vorschlag erscheint auf Heute und lässt sich einplanen', async ({ page, request }) => {
    const isoTomorrow = (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    })();
    const suffix = `${Date.now()}`;
    const ingredientName = `E2E-Ablaufzutat-${suffix}`;
    const plan = await (await request.post(`${API_URL}/plans`, { data: { name: `E2E-Sammlung-${suffix}` } })).json();
    const dish = await (await request.post(`${API_URL}/plans/${plan.id}/dishes`, {
      multipart: {
        name: `E2E-Restegericht-${suffix}`,
        image: { name: 'dish.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64') },
      },
    })).json();
    const ingredient = await (await request.post(`${API_URL}/ingredients`, {
      data: { name: ingredientName, kcalPer100: 100, proteinPer100: 5, unit: 'g' },
    })).json();
    await request.post(`${API_URL}/dishes/${dish.id}/ingredients`, { data: { ingredientId: ingredient.id, quantityGrams: 100 } });
    const [pantryItem] = await (await request.post(`${API_URL}/pantry/batches`, {
      // Less than one meal needs, so planning the dish uses it up completely
      data: { items: [{ ingredientName, quantity: 50, unit: 'g', expiresOn: isoTomorrow }] },
    })).json();

    try {
      await page.goto('/');
      const card = page.getByTestId('use-soon');
      await expect(card).toContainText(ingredientName);
      const suggestion = card.getByTestId('use-soon-dish').filter({ hasText: dish.name });
      await expect(suggestion).toContainText(`verbraucht ${ingredientName}`);
      await expect(suggestion).toContainText('1 Zutat fehlt');

      // "Heute einplanen", or the next open day if today's meal is already cooked
      await suggestion.getByRole('button', { name: /einplanen$/ }).click();
      await expect(card.getByRole('status')).toContainText(`${dish.name} ersetzt`);
      await expect(page.locator('article.meal-card', { hasText: dish.name })).toBeVisible();
      // Planned now, so the stock no longer needs a suggestion
      await expect(card.locator('.expiring-items li', { hasText: ingredientName })).toContainText('eingeplant');
      await expect(card.getByTestId('use-soon-dish').filter({ hasText: dish.name })).toHaveCount(0);
    } finally {
      await request.delete(`${API_URL}/pantry/${pantryItem.id}`);
      await request.delete(`${API_URL}/plans/${plan.id}`);
    }
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

baseTest.describe('Einrichtung beim ersten Start', () => {
  baseTest('drei Fragen statt Feature-Tour; die Antworten werden gespeichert', async ({ page, request }) => {
    const before = await (await request.get(`${API_URL}/profile`)).json();
    try {
      await page.goto('/');
      const dialog = page.getByRole('dialog');
      await expect(dialog.getByRole('heading', { name: 'Für wen kochst du?' })).toBeVisible();
      await expect(dialog.getByTestId('household-size')).toHaveText(String(Math.max(1, before.householdSize)));
      await dialog.getByRole('button', { name: 'Eine Person mehr' }).click();
      await dialog.getByRole('radio', { name: '3×' }).click();
      await dialog.getByRole('button', { name: 'Weiter' }).click();

      await expect(dialog.getByRole('heading', { name: 'Was schmeckt dir?' })).toBeVisible();
      const firstTag = dialog.getByRole('group', { name: 'Geschmack' }).getByRole('button').first();
      const tag = (await firstTag.innerText()).trim().toLowerCase();
      await firstTag.click();
      await dialog.getByRole('button', { name: 'Weiter' }).click();

      await expect(dialog.getByRole('heading', { name: 'Womit startest du?' })).toBeVisible();
      await expect(dialog.getByRole('radiogroup', { name: 'Startplan' }).getByRole('radio').first()).toBeVisible();
      await dialog.getByRole('radio', { name: /Später entscheiden/ }).click();
      await dialog.getByRole('button', { name: "Los geht's" }).click();
      await expect(dialog).toBeHidden();
      await expect(page.getByRole('heading', { level: 1, name: 'Heute' })).toBeVisible();

      const after = await (await request.get(`${API_URL}/profile`)).json();
      expect(after.householdSize).toBe(Math.max(1, before.householdSize) + 1);
      expect(after.shoppingTripsPerWeek).toBe(3);
      const taste = await (await request.get(`${API_URL}/taste`)).json();
      expect(taste.likedTags).toContain(tag);

      // Not shown again
      await page.reload();
      await expect(page.locator('#meal-schedule-title')).toBeVisible();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    } finally {
      await request.put(`${API_URL}/profile`, { data: before });
      await request.put(`${API_URL}/taste`, { data: { likedTags: [] } });
    }
  });
});
