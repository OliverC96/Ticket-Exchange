import { test as base } from '@playwright/test';

export const test = base.extend<{ forEachTest: void }>({
    forEachTest: [async ({ page }, use) => {
        await page.goto("/");
        await use();
        await page.close();
    }, { auto: true }]
});