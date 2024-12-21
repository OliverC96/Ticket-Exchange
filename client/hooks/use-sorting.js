import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";

// Custom hook to manage the sorting of ticket listings
export default ({ tickets, setTickets }) => {

    const posthog = usePostHog();

    const [priceEnabled, setPriceEnabled] = useState(false);
    const [priceAscending, setPriceAscending] = useState(true);
    const [titleEnabled, setTitleEnabled] = useState(false);
    const [titleAscending, setTitleAscending] = useState(true);

    // Update the current sorting options
    const updateSortingOptions = (type) => {
        if (type === "price") {
            setPriceAscending(!priceAscending);
            setPriceEnabled(true);
            setTitleEnabled(false);
        }
        else if (type === "title") {
            setTitleAscending(!titleAscending);
            setTitleEnabled(true);
            setPriceEnabled(false);
        }
    };

    // Clear all sorting options
    const resetSortingOptions = () => {
        setTitleEnabled(false);
        setPriceEnabled(false);
    };

    // Title-based sorting algorithm
    const titleSort = (a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    }

    // Price-based sorting algorithm
    const priceSort = (a, b) => {
        return a.price - b.price;
    }

    useEffect(() => {
        // Apply title-based sorting
        if (titleEnabled) {
            let sortedCollection;
            posthog?.capture("tickets_sorted", {
                type: "title",
                ascending: titleAscending,
                source: "frontend"
            });
            if (titleAscending) {
                sortedCollection = tickets.toSorted(titleSort); // Ascending order
            }
            else {
                sortedCollection = tickets.toSorted(titleSort).reverse(); // Descending order
            }
            setTickets(sortedCollection);
        }
        // Apply price-based sorting
        else if (priceEnabled) {
            let sortedCollection;
            posthog?.capture("tickets_sorted", {
                type: "price",
                ascending: priceAscending,
                source: "frontend"
            });
            if (priceAscending) {
                sortedCollection = tickets.toSorted(priceSort); // Ascending order
            }
            else {
                sortedCollection = tickets.toSorted(priceSort).reverse(); // Descending order
            }
            setTickets(sortedCollection);
        }
    }, [priceEnabled, titleEnabled, priceAscending, titleAscending]);

    return {
        title: {
            isEnabled: titleEnabled,
            isAscending: titleAscending,
        },
        price: {
            isEnabled: priceEnabled,
            isAscending: priceAscending
        },
        updateSortingOptions,
        resetSortingOptions
    };
}