import {
    expect,
    Page,
    Cookie
} from "@playwright/test";
import { test } from "./fixtures/fixtures";
import { navLinks } from "./utils/nav-links";
import { authenticate, logout } from "./utils/auth";

const testNavLinks = async (page: Page): Promise<void> => {
    const cookies: Cookie[] = await page.context().cookies();
    let isAuthenticated = false;
    for (const cookie of cookies) {
        if (cookie.name === "session" && cookie.value.slice(0, 2) === "ey") {
            isAuthenticated = true;
        }
    }
    for (const { label, href } of navLinks.filter(link => link.requiresAuth === isAuthenticated)) {
        const link = page.getByText(label);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", href);
        await link.click();
        await expect(page).toHaveURL(href);
        await page.goto("/");
    }
};

test.beforeEach(() => async ({ page }) => {
    await page.goto("/");
});

test.describe("User is authenticated", async() => {
    test("All navigation links are visible", async ({ page }) => {
        await authenticate(page);
        await testNavLinks(page);
        await logout(page);
    });
});

test.describe("User is NOT authenticated", async() => {
    test("All navigation links are visible", async ({ page }) => {
        await page.goto("/");
        await testNavLinks(page);
    });
});