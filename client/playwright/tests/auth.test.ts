import { expect } from "@playwright/test";
import { test } from "./fixtures/fixtures";
import {
    generateEmail,
    generatePassword,
    OAuthMethods
} from "./utils/auth";
import { errorMessages } from "./utils/error-messages";

const email = generateEmail("gmail.com");
const password = generatePassword(10);

const testOAuth = (): void => {
    OAuthMethods.forEach(({ type, url }) => {
        test(`${type} OAuth 2.0 works correctly`, async({ page }) => {
            await page.getByText(`Continue with ${type}`).click();
            await expect(page).toHaveURL(url);
        });
    });
}

test.describe.configure({ mode: 'serial' });

test.describe("Registration methods work properly", async() => {
    test.beforeEach(async({ page }) => {
        await page.goto("/auth/register");
    });
    test.afterEach(async({ page }) => {
        await page.goto("/auth/logout");
    });
    testOAuth();
    test.describe("Native registration", async() => {
        test("Is unsuccessful with invalid form inputs", async({ page }) => {
            await page.getByRole("checkbox").setChecked(true);
            await page.getByRole("button", { name: "Register" }).click();
            await expect(page).toHaveURL("/auth/register");
            const errorCard = page.locator(".card-error");
            await expect(errorCard).toBeVisible();
            await expect(errorCard.getByRole("listitem")).toHaveText(errorMessages["Register"]);
        });
        test("Is successful with valid form inputs", async({ page }) => {
            const [
                emailField,
                passwordField,
                confirmPasswordField
            ] = await page.getByRole("textbox").all();
            await emailField.fill(email);
            await passwordField.fill(password);
            await confirmPasswordField.fill(password);
            await page.getByRole("checkbox").setChecked(true);
            await page.getByRole("button", { name: "Register" }).click();
            await page.waitForURL("/");
        });
    });
});

test.describe("Login methods work properly", async() => {
    test.beforeEach(async({ page }) => {
        await page.goto("/auth/login");
    });
    test.afterEach(async({ page }) => {
        await page.goto("/auth/logout");
    });
    testOAuth();
    test.describe("Native login", async() => {
        test("Is unsuccessful with invalid form inputs", async({ page }) => {
            await page.getByRole("button", { name: "Login" }).click();
            await expect(page).toHaveURL("/auth/login");
            const errorCard = page.locator(".card-error");
            await expect(errorCard).toBeVisible();
            await expect(errorCard.getByRole("listitem")).toHaveText(errorMessages["Login"]);
        });
        test("Is successful with valid form inputs", async({ page }) => {
            const [
                emailField,
                passwordField
            ] = await page.getByRole("textbox").all();
            await emailField.fill(email);
            await passwordField.fill(password);
            await page.getByRole("button", { name: "Login" }).click();
            await page.waitForURL("/");
        });
    });
});