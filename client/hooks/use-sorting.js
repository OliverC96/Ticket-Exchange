import { useState, useEffect } from "react";

export default ({ tickets, setTickets, originalTickets }) => {

    const [priceEnabled, setPriceEnabled] = useState(false);
    const [priceAscending, setPriceAscending] = useState(true);
    const [titleEnabled, setTitleEnabled] = useState(false);
    const [titleAscending, setTitleAscending] = useState(true);

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

    const resetSortingOptions = () => {
        setTitleEnabled(false);
        setPriceEnabled(false);
    };

    const titleSort = (a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    }

    const priceSort = (a, b) => {
        return a.price - b.price;
    }

    useEffect(() => {
        if (titleEnabled) {
            let sortedCollection;
            if (titleAscending) {
                sortedCollection = tickets.toSorted(titleSort);
            }
            else {
                sortedCollection = tickets.toSorted(titleSort).reverse();
            }
            setTickets(sortedCollection);
        }
        else if (priceEnabled) {
            let sortedCollection;
            if (priceAscending) {
                sortedCollection = tickets.toSorted(priceSort);
            }
            else {
                sortedCollection = tickets.toSorted(priceSort).reverse();
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