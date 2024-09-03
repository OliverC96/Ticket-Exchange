import { useEffect, useState } from "react";

// Custom hook to manage filter form input
export default ({ tickets, setTickets, resetSortingOptions }) => {

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
        maxPrice: Infinity
    });

    const [invalid, setInvalid] = useState({
        minPrice: false,
        maxPrice: false
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
        if (filters.maxPrice < Infinity) {
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
        // Update state to reflect the new value
        setInput((prev) => {
            return {
                ...prev,
                [name]: value
            }
        });
        // No form validation is performed on the keywords field; terminate early
        if (name === "keywords") {
            return;
        }
        if (value === "") {
            setInvalid((prev) => ({
                ...prev,
                [name]: false
            }));
            return;
        }
        if (name === "minPrice") {
            const newMinPrice = parseFloat(value);
            // Min price field is currently invalid
            if ((newMinPrice < 0) || (newMinPrice > parseFloat(input.maxPrice)) || (newMinPrice > filters.maxPrice)) {
                setInvalid({
                    minPrice: true,
                    maxPrice: false
                });
            }
            // Min price field is currently valid
            else {
                setInvalid((prev) => ({
                    minPrice: false,
                    maxPrice: prev.maxPrice
                }));
            }
        }
        else if (name === "maxPrice") {
            const newMaxPrice = parseFloat(value);
            // Max price field is currently invalid
            if ((newMaxPrice < 0) || (newMaxPrice < parseFloat(input.minPrice)) || (newMaxPrice < filters.minPrice)) {
                setInvalid({
                    minPrice: false,
                    maxPrice: true
                });
            }
            // Max price field is currently valid
            else {
                setInvalid((prev) => ({
                    minPrice: prev.minPrice,
                    maxPrice: false
                }));
            }
        }
    };

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
            maxPrice: Infinity
        });
        setInvalid({
            minPrice: false,
            maxPrice: false
        });
    };

    // Helper method which updates the filter list based on the current input
    const updateFilters = () => {
        // Append the new keyword filters (if any) to the existing collection of keywords
        // Replace the current min/max price filters with the new values (when applicable)
        setFilters((prev) => {
            return {
                keywords: input.keywords === "" ? prev.keywords : prev.keywords.concat(input.keywords.split(" ")),
                minPrice: input.minPrice === "" ? prev.minPrice : parseFloat(input.minPrice),
                maxPrice: input.maxPrice === "" ? prev.maxPrice : parseFloat(input.maxPrice),
            }
        });
    }

    async function handleSubmission(event) {
        event.preventDefault();
        updateFilters();
    }

    return {
        input,
        filters,
        invalid,
        handleChange,
        handleSubmission,
        removeFilter,
        resetFilters
    };
}