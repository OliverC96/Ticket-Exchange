import { expect, test } from "@playwright/test";
import { Request, orderRequests } from "./utils/requests";
import { assertRequest } from "./utils/custom-assertions";

test.describe("User is NOT authenticated", async () => {
    orderRequests.forEach((r: Request) => {
        test(`User cannot access ${r.method.toUpperCase()} ${r.path}`, async ({ page }) => {
            await assertRequest(page, r);
        });
    });
});