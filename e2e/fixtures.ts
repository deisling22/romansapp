import { test as base, expect, Page } from '@playwright/test';

export const API_URL = 'http://localhost:8080/api';

type Fixtures = {
  serverErrors: string[];
  apiRequests: { method: string; url: string }[];
};

/**
 * Skips onboarding and records every API request and every 5xx response.
 * A test fails automatically if the backend answered with a server error.
 */
export const test = base.extend<Fixtures>({
  serverErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('response', (response) => {
        if (response.url().startsWith(API_URL) && response.status() >= 500) {
          errors.push(`${response.status()} ${response.request().method()} ${response.url()}`);
        }
      });
      await use(errors);
      expect(errors, 'Backend hat mit 5xx geantwortet').toEqual([]);
    },
    { auto: true },
  ],
  apiRequests: async ({ page }, use) => {
    const requests: { method: string; url: string }[] = [];
    page.on('request', (request) => {
      if (request.url().startsWith(API_URL)) {
        requests.push({ method: request.method(), url: request.url() });
      }
    });
    await use(requests);
  },
  page: async ({ page }, use) => {
    await page.addInitScript(() => localStorage.setItem('speiseplan_onboarding_completed', 'true'));
    await use(page);
  },
});

export { expect };

export function tabLink(page: Page, name: 'Heute' | 'Pläne' | 'Gerichte' | 'Einkauf') {
  return page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name, exact: true });
}

export async function openTab(page: Page, name: 'Heute' | 'Pläne' | 'Gerichte' | 'Einkauf'): Promise<void> {
  await tabLink(page, name).click();
}

export function countRequests(
  requests: { method: string; url: string }[],
  method: string,
  pattern: RegExp,
): number {
  return requests.filter((request) => request.method === method && pattern.test(request.url)).length;
}
