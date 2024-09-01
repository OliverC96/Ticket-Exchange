import { useEffect, useState } from "react";

// Custom hook to manage filter form input
export default ({ minPriceRef, maxPriceRef, tickets, setTickets, resetSortingOptions }) => {

    // Keeps track of current form input (cleared upon form submission)
    const [input, setInput] = useState({
        keywords: "",
        minPrice: "",
        maxPrice: ""
    });

    // Keeps track of current filters (persists beyond form submission)
    const [filters, setFilters] = useState({
        keywords: [],
        minPrice: 0,
        maxPrice: 0
    });

    // Title-based filter algorithm
    const titleFilter = (ticket) => {
        // Iterate over all keywords present in the filter string
        for (const k of filters.keywords) {
            if (!ticket.title.toLowerCase().includes(k.toLowerCase())) {
                return false;
            }
        }
        // Ticket is a match only if its title contains ALL keywords in the filter string
        return true;
    }

    // Apply filters to listings whenever the filter list is changed
    useEffect(() => {
        let filteredCollection = tickets;
        // Title-based (keyword) filtering
        if (filters.keywords.length !== 0) {
            filteredCollection = filteredCollection.filter(titleFilter);
        }
        // Minimum price filtering
        if (filters.minPrice > 0) {
            filteredCollection = filteredCollection.filter(t => t.price >= filters.minPrice);
        }
        // Maximum price filtering
        if (filters.maxPrice > 0) {
            filteredCollection = filteredCollection.filter(t => t.price <= filters.maxPrice);
        }
        setTickets(filteredCollection);
        // Clear form input
        setInput({
            keywords: "",
            minPrice: "",
            maxPrice: ""
        });
        resetSortingOptions();
    }, [filters]);

    const handleChange = (event) => {
        let { name, value } = event.target;
        setInput((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    const onBlur = (event) => {
        const { name } = event.target;
        let value = input[name];
        if (value.charAt(0) === '$') {
            value = value.slice(1);
        }
        value = parseFloat(value);
        if (isNaN(value)) {
            return;
        }
        setInput((prev) => {
            return {
                ...prev,
                [name]: "$" + value.toFixed(2)
            };
        });
    }

    // Eliminates a particular filter from the filter list
    const removeFilter = (type, value) => {
        let newValue = value;
        if (type === "keywords") {
            newValue = filters.keywords.filter(k => k !== value);
        }
        setFilters((prev) => {
            return {
                ...prev,
                [type]: newValue
            }
        });
    };

    // Clears the filter list (i.e., unconditionally displays all listings)
    const resetFilters = () => {
        setFilters({
            keywords: [],
            minPrice: 0,
            maxPrice: 0
        });
    };

    // Helper method which updates the filter list based on the current input
    const updateFilters = () => {
        // Append the new keyword filters (if any) to the existing collection of keywords
        // Replace the current min/max price filters with the new values (when applicable)
        setFilters((prev) => {
            return {
                keywords: input.keywords === "" ? prev.keywords : prev.keywords.concat(input.keywords.split(" ")),
                minPrice: input.minPrice === "" ? prev.minPrice : parseFloat(input.minPrice.slice(1)),
                maxPrice: input.maxPrice === "" ? prev.maxPrice : parseFloat(input.maxPrice.slice(1)),
            }
        });
    }

    async function handleSubmission(event) {
        event.preventDefault();
        minPriceRef.current.focus();
        minPriceRef.current.blur();
        maxPriceRef.current.focus();
        maxPriceRef.current.blur();
        updateFilters();
    }

    return {
        input,
        filters,
        handleChange,
        onBlur,
        handleSubmission,
        removeFilter,
        resetFilters
    };
}