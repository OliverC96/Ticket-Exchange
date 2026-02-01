import {
    APIResponse,
    expect,
    Locator,
    Page
} from "@playwright/test";
import { Request } from "./requests";

const assertLabels = async (locator: Locator, labels: string[]): Promise<void> => {
    for (const label of labels) {
        await expect(locator.getByText(label)).toBeVisible();
    }
}

const assertRequest = async (page: Page, req: Request): Promise<void> => {
    const { method, path, data } = req;
    const res: APIResponse = await page.request[method](
        path,
        { data }
    );
    const errorMessage = (await res.json())["errors"][0]["message"];
    expect(errorMessage).toEqual("User not authorized to access this resource.");
    expect(res.status()).toEqual(401);
    expect(res.headers()["Cookie"]).toBeUndefined();
}

export {
    assertLabels,
    assertRequest
}