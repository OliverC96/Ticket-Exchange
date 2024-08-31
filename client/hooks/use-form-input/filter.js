import { useEffect, useState } from "react";

export default ({ minPriceRef, maxPriceRef, tickets, setTickets, resetSortingOptions }) => {
    const [input, setInput] = useState({
        keywords: "",
        minPrice: "",
        maxPrice: ""
    });
    const [filters, setFilters] = useState({
        keywords: [],
        minPrice: 0,
        maxPrice: 0
    });

    useEffect(() => {
        let filteredCollection = tickets;
        if (filters.keywords.length !== 0) {
            filteredCollection = filteredCollection.filter((t) => {
                for (const k of filters.keywords) {
                    if (!t.title.toLowerCase().includes(k.toLowerCase())) {
                        return false;
                    }
                }
                return true;
            });
        }
        if (filters.minPrice > 0) {
            filteredCollection = filteredCollection.filter(t => t.price >= filters.minPrice);
        }
        if (filters.maxPrice > 0) {
            filteredCollection = filteredCollection.filter(t => t.price <= filters.maxPrice);
        }
        setTickets(filteredCollection);
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

    const resetFilters = () => {
        setFilters({
            keywords: [],
            minPrice: 0,
            maxPrice: 0
        });
    };

    async function handleSubmission(event) {
        event.preventDefault();
        minPriceRef.current.focus();
        minPriceRef.current.blur();
        maxPriceRef.current.focus();
        maxPriceRef.current.blur();
        setFilters((prev) => {
            return {
                keywords: input.keywords === "" ? prev.keywords : prev.keywords.concat(input.keywords.split(" ")),
                minPrice: input.minPrice === "" ? prev.minPrice : parseFloat(input.minPrice.slice(1)),
                maxPrice: input.maxPrice === "" ? prev.maxPrice : parseFloat(input.maxPrice.slice(1)),
            }
        });
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