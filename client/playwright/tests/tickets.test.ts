import {
    expect,
    Locator,
    APIResponse
} from "@playwright/test";
import { test } from "./fixtures/fixtures";
import {
    Ticket,
    filterOptions,
    sortingOptions
} from "./utils/tickets";
import { ticketRequests } from "./utils/requests";
import { authenticate, logout } from "./utils/auth";
import { errorMessages } from "./utils/error-messages";
import IndexPage from "./helpers/index-page";

type Payload = {
    id: string,
    email: string
}

const assertLabels = async (locator: Locator, labels: string[]): Promise<void> => {
    for (const label of labels) {
        await expect(locator.getByText(label)).toBeVisible();
    }
}

test("User can view, filter, and sort listings", async({ page }) => {
    const indexPage = new IndexPage(page);
    for (const c of filterOptions) {
        await indexPage.testFilters(c);
    }
    for (const c of sortingOptions) {
        await indexPage.testSorting(c);
    }
});

test.describe("User is authenticated", async () => {
    test.beforeEach("Authenticate user", async ({ page }) => {
        await authenticate(page);
    });
    test.afterEach("Logout user", async ({ page }) => {
        await logout(page);
    });
    test.describe("Creating a new listing", async () => {
        test.beforeEach(async({ page }) => {
            await page.goto("/tickets/create");
        });
        test("Is unsuccessful with invalid form inputs", async ({ page }) => {
            await page.getByRole("button", { name: "Create" }).click();
            const errorCard = page.locator(".card-error");
            await expect(errorCard).toBeVisible();
            await expect(errorCard.getByRole("listitem")).toHaveText(errorMessages["Create"]);
        });
        test("Is successful with valid form inputs", async ({ page }) => {
            const indexPage = new IndexPage(page);
            const testTicket: Ticket = {
                title: "E2E Test",
                price: 140
            };
            const [titleField, priceField] = await indexPage.page.getByRole("textbox").all();
            await titleField.fill(testTicket.title);
            await priceField.fill(testTicket.price.toString());
            await indexPage.page.getByRole("button", { name: "Create" }).click();
            await expect(indexPage.page).toHaveURL("/");

            let l: Locator;
            const ticketGrid = indexPage.page.locator(".ticket-grid");
            l = await indexPage.findListing(testTicket);

            const editButton = l.locator(".icon-btn").first();
            await editButton.click();
            const editForm = indexPage.page.locator(".modal-wrapper form");
            await expect(editForm).toBeVisible();
            await assertLabels(editForm, [`Edit ${testTicket.title}`, "Title", "Price (CAD)"]);

            const updatedTicket: Ticket = {
                title: testTicket.title + " - NEW!",
                price: testTicket.price - 25
            }
            const [newTitle, newPrice] = await indexPage.page.getByRole("textbox").all();
            await newTitle.fill(updatedTicket.title);
            await newPrice.fill(updatedTicket.price.toString());
            await editForm.getByRole("button", { name: "Save" }).click();

            await expect(editForm).toBeHidden();
            l = await indexPage.findListing(updatedTicket);
            const deleteButton = l.locator(".icon-btn").nth(1);
            await deleteButton.click();

        });
    });
    test.describe("Updating an existing listing", async () => {
        test("Is unsuccessful with invalid form inputs", async ({ page }) => {

        });
        test("Is successful with valid form inputs", async ({ page }) => {

        });
    });
    test.describe("Deleting an existing listing", async () => {
        test("Is unsuccessful with invalid form inputs", async ({ page }) => {

        });
        test("Is successful with valid form inputs", async ({ page }) => {

        });
    });
});

test.describe("User is NOT authenticated", async () => {
    ticketRequests.forEach(({ method, path, data }) => {
        test(`User cannot access ${method.toUpperCase()} ${path}`, async ({ page }) => {
            const res: APIResponse = await page.request[method](
                path,
                { data }
            );
            const errorMessage = (await res.json())["errors"][0]["message"];
            expect(errorMessage).toEqual("User not authorized to access this resource.");
            expect(res.status()).toEqual(401);
            expect(res.headers()["Cookie"]).toBeUndefined();
        });
    });
});