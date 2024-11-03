type Ticket = {
    title: string,
    price: number
}

type SortConfig = {
    type: "Price" | "Title",
    ascending: boolean
}

type FilterConfig = {
    keywords: string[],
    minPrice: number,
    maxPrice: number
}

const sortingOptions: SortConfig[] = [
    {
        type: "Price",
        ascending: false
    },
    {
        type: "Price",
        ascending: true
    },
    {
        type: "Title",
        ascending: false
    },
    {
        type: "Title",
        ascending: true
    }
];

const filterOptions: FilterConfig[] = [
    {
        keywords: ["Rock", "Concert"],
        minPrice: 140,
        maxPrice: 1000
    },
    {
        keywords: ["Concert"],
        minPrice: 0,
        maxPrice: 500
    },
    {
        keywords: [],
        minPrice: 55,
        maxPrice: 200
    },
    {
        keywords: [],
        minPrice: 0,
        maxPrice: Infinity
    },
    {
        keywords: ["Festival"],
        minPrice: 0,
        maxPrice: Infinity
    }
];

// Title-based sorting algorithm
const titleSort = (a: Ticket, b: Ticket): number => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
}

// Price-based sorting algorithm
const priceSort = (a: Ticket, b: Ticket): number => {
    return a.price - b.price;
}

const filterListings = async (listings: Ticket[], config: FilterConfig): Promise<Ticket[]> => {
    let filteredListings: Ticket[] = listings;
    if (config.keywords.length > 0) {
        filteredListings = filteredListings.filter(l => {
            // Iterate over all keywords present in the filter string
            for (const k of config.keywords) {
                if (!l.title.toLowerCase().includes(k.toLowerCase())) {
                    return false;
                }
            }
            // Ticket is a match only if its title contains ALL keywords in the filter string
            return true;
        });
    }
    if (config.minPrice > 0) {
        filteredListings = filteredListings.filter(l => l.price >= config.minPrice);
    }
    if (0 < config.maxPrice && config.maxPrice < Infinity) {
        filteredListings = filteredListings.filter(l => l.price <= config.maxPrice);
    }
    return filteredListings;
}

const sortListings = async (listings: Ticket[], config: SortConfig): Promise<Ticket[]> => {
    let sortedListings: Ticket[];
    if (config.type === "Title") {
        // @ts-ignore
        sortedListings = listings.toSorted(titleSort);
    }
    else if (config.type === "Price") {
        // @ts-ignore
        sortedListings = listings.toSorted(priceSort);
    }
    if (!config.ascending) {
        sortedListings.reverse();
    }
    return sortedListings;
}

export {
    Ticket,
    SortConfig,
    FilterConfig,
    filterOptions,
    sortingOptions,
    sortListings,
    filterListings
};