import { test } from "@playwright/test";
import { Request, paymentRequests } from "./utils/requests";
import { assertRequest } from "./utils/custom-assertions";

test.describe("User is NOT authenticated", async () => {
    paymentRequests.forEach((r: Request) => {
        test(`User cannot access ${r.method.toUpperCase()} ${r.path}`, async ({ page }) => {
            await assertRequest(page, r);
        });
    });
});