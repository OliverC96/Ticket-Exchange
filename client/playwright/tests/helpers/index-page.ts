import { expect, Locator, Page } from "@playwright/test";
import {
    Ticket,
    SortConfig,
    FilterConfig,
    sortListings,
    filterListings
} from "../utils/tickets";
import { assertLabels } from "../utils/custom-assertions";

export default class IndexPage {
    readonly page: Page;
    readonly ticketGrid: Locator;
    readonly filterForm: Locator;
    readonly sortingForm: Locator;

    constructor(page: Page) {
        this.page = page;
        this.ticketGrid = page.locator(".ticket-grid");
        this.filterForm = page.locator(".filter-form");
        this.sortingForm = this.ticketGrid.locator("div").first();
    }

    async getListings(): Promise<Ticket[]> {
        const items: Locator[] = await this.ticketGrid.locator("div > .card").all();
        let listings: Ticket[] = [];
        for (const item of items) {
            const title = await item.locator("h1").innerText();
            const priceText = await item.locator("h3 > p").innerText()
            listings.push({
                title,
                price: parseInt(priceText.slice(1))
            });
        }
        return listings;
    }

    async findListing(t: Ticket): Promise<Locator> {
        const listing: Locator = this.ticketGrid.locator("div:nth-child(n+2)")
            .filter({ hasText: t.title })
            .filter({ hasText: `\$${t.price.toString()}`})
        await expect(listing).toBeVisible();
        return listing;
    }

    async testSorting(config: SortConfig): Promise<void> {
        await assertLabels(this.sortingForm, ["Sort Results"]);
        const sortButton = this.sortingForm.getByRole("button", { name: config.type });
        await sortButton.click();

        const listings: Ticket[] = await this.getListings();
        const sortedListings: Ticket[] = await sortListings(listings, config);
        for (let i = 0; i < listings.length; i++) {
            expect(listings[i]).toStrictEqual(sortedListings[i]);
        }
    }

    async testFilters(config: FilterConfig): Promise<void> {
        await assertLabels(this.filterForm, ["Filter Results", "Keywords", "Price"]);
        const [applyFilters, resetFilters] = await this.filterForm.getByRole("button").all();
        const originalListings: Ticket[] = await this.getListings();

        const [
            keywordFilter,
            minPriceFilter,
            maxPriceFilter
        ] = await this.filterForm.getByRole("textbox").all();
        await keywordFilter.fill(config.keywords.join(" "));
        await minPriceFilter.fill(config.minPrice.toString());
        await maxPriceFilter.fill(config.maxPrice.toString());
        await applyFilters.click();

        let listings: Ticket[] = await this.getListings();
        const filteredListings: Ticket[] = await filterListings(originalListings, config);
        for (let i = 0; i < listings.length; i++) {
            expect(listings[i]).toStrictEqual(filteredListings[i]);
        }

        await resetFilters.click();
        listings = await this.getListings();
        expect(listings).toHaveLength(originalListings.length);
    }

}