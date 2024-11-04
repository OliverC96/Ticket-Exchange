import { expect, Locator } from "@playwright/test";

export const assertLabels = async (locator: Locator, labels: string[]): Promise<void> => {
    for (const label of labels) {
        await expect(locator.getByText(label)).toBeVisible();
    }
}