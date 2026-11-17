import { expect, test } from '@playwright/test';

function receiptPdf(): Buffer {
  const content = 'BT /F1 14 Tf 50 780 Td (NETTO) Tj 0 -25 Td (Butter 250g 1,99 A) Tj 0 -25 Td (Brot 2,49 A) Tj 0 -25 Td (SUMME 4,48) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const [index, object] of objects.entries()) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  }
  const xref = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('speiseplan_onboarding_completed', 'true'));
  await page.route('**/api/**', (route) => route.fulfill({ json: [] }));
});

test('plus menu opens import; edited selection is sent only after confirmation', async ({ page }) => {
  const batches: unknown[] = [];
  await page.route('**/api/pantry/batches', async (route) => {
    batches.push(route.request().postDataJSON());
    await route.fulfill({ json: [] });
  });
  await page.goto('/#/purchase-import');
  await page.getByRole('button', { name: 'Hinzufügen und weitere Bereiche' }).click();
  await page.getByRole('menuitem', { name: 'Kassenbon importieren' }).click();
  await page.getByLabel('Einkaufstext (ein Artikel pro Zeile)').fill('500 g Tomaten\n2 Zwiebeln\nSeife');
  await page.getByRole('button', { name: 'Artikel aus Text erkennen' }).click();
  await expect(page.getByRole('textbox', { name: 'Artikelname 1', exact: true })).toHaveValue('Tomaten');
  await page.getByRole('spinbutton', { name: 'Menge 1', exact: true }).fill('750');
  await page.getByRole('checkbox', { name: 'Artikel 3 übernehmen' }).uncheck();
  expect(batches).toEqual([]);
  await page.getByRole('button', { name: 'In den Vorrat übernehmen' }).click();
  await expect(page.getByRole('status')).toContainText('2 Artikel wurden');
  expect(batches).toEqual([{ items: [
    { ingredientName: 'Tomaten', quantity: 750, unit: 'g' },
    { ingredientName: 'Zwiebeln', quantity: 2, unit: 'Stk.' },
  ] }]);
  await expect(page.getByRole('button', { name: 'In den Vorrat übernehmen' })).toBeDisabled();
});

test('extracts actual PDF text through the bundled PDF worker', async ({ page }) => {
  await page.goto('/#/purchase-import');
  await page.locator('input[accept*="application/pdf"]').setInputFiles({
    name: 'netto-bon.pdf', mimeType: 'application/pdf', buffer: receiptPdf(),
  });
  await expect(page.getByRole('textbox', { name: 'Artikelname 1', exact: true })).toHaveValue('Butter');
  await expect(page.getByRole('spinbutton', { name: 'Menge 1', exact: true })).toHaveValue('250');
  await expect(page.getByRole('combobox', { name: 'Einheit 1', exact: true })).toHaveValue('g');
  await expect(page.getByRole('textbox', { name: 'Artikelname 2', exact: true })).toHaveValue('Brot');
  await expect(page.getByRole('spinbutton', { name: 'Menge 2', exact: true })).toHaveValue('1');
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('accepts OS-shared shopping text without booking stock or leaving data in the URL', async ({ page }) => {
  await page.goto(`/?${new URLSearchParams({ title: 'Netto Einkaufsliste', text: '1kg Mehl\n3 Eier' })}`);
  await expect(page).toHaveURL(/#\/purchase-import$/);
  await expect(page.getByRole('textbox', { name: 'Artikelname 1', exact: true })).toHaveValue('Mehl');
  await expect(page.getByRole('spinbutton', { name: 'Menge 1', exact: true })).toHaveValue('1000');
  await expect(page.getByRole('textbox', { name: 'Artikelname 2', exact: true })).toHaveValue('Eier');
});

test('handles dropped text and reports invalid PDFs', async ({ page }) => {
  await page.goto('/#/purchase-import');
  const transfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.setData('text/plain', '2 Zwiebeln');
    return data;
  });
  await page.getByRole('region', { name: 'Einkauf importieren' }).dispatchEvent('drop', { dataTransfer: transfer });
  await expect(page.getByRole('textbox', { name: 'Artikelname 1', exact: true })).toHaveValue('Zwiebeln');
  await page.locator('input[accept*="application/pdf"]').setInputFiles({
    name: 'defekt.pdf', mimeType: 'application/pdf', buffer: Buffer.from('not a PDF'),
  });
  await expect(page.getByRole('alert')).toContainText('Datei konnte nicht gelesen werden');
  await expect(page.getByRole('textbox', { name: 'Artikelname 1', exact: true })).toHaveValue('Zwiebeln');
});

test('retains the selection and shows an explicit error on failed stock import', async ({ page }) => {
  await page.route('**/api/pantry/batches', (route) => route.fulfill({ status: 400, json: { message: 'invalid' } }));
  await page.goto('/#/purchase-import');
  await page.getByLabel('Einkaufstext (ein Artikel pro Zeile)').fill('Brot');
  await page.getByRole('button', { name: 'Artikel aus Text erkennen' }).click();
  await page.getByRole('button', { name: 'In den Vorrat übernehmen' }).click();
  await expect(page.getByRole('alert')).toContainText('nicht bestätigt');
  await expect(page.getByRole('textbox', { name: 'Artikelname 1', exact: true })).toHaveValue('Brot');
});
