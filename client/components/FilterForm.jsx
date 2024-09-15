import useFilter from "../hooks/use-form-input/filter";
import FilterButton from "../components/FilterButton";
import { useRef, useEffect, useState } from "react";
import { FaCodeBranch } from "react-icons/fa6";
import { ToggleSlider } from "react-toggle-slider";

// Filter form component; allows users to filter ticket listings based on price or title keywords
export default function FilterForm({ tickets, setTickets, resetSortingOptions }) {

    // Retrieve the ID(s) corresponding to the discounted ticket(s) from local browser storage
    const [discountID, setDiscountID] = useState("");
    useEffect(() => {
        const { discountID } = JSON.parse(localStorage.getItem("discount"));
        setDiscountID(discountID);
    }, []);

    const minPriceRef = useRef(null);
    const maxPriceRef = useRef(null);
    const {
        input,
        filters,
        invalid,
        handleChange,
        handleSubmission,
        removeFilter,
        resetFilters,
        toggleDiscountFilter
    } = useFilter({
        discountID,
        tickets,
        setTickets,
        resetSortingOptions
    });

    return (
        <form className="filter-form" onSubmit={handleSubmission}>
            <div className="flex gap-3">
                <FaCodeBranch size={25}/>
                <p className="text-xl"> Filter Results </p>
            </div>
            {/* Title-based filtering via space-delimited keyword string */}
            <div className="form-field">
                <label id="keyword"> Keywords </label>
                <div className="flex flex-col gap-2">
                    <input
                        className="form-input !py-1"
                        name="keywords"
                        value={input.keywords}
                        onChange={handleChange}
                        placeholder="e.g. Concert"
                    />
                    {/* Display the set of active keyword filters */}
                    <div className="grid grid-cols-2 gap-2">
                        {filters.keywords.map((keyword, index) => {
                            return (
                                <FilterButton
                                    key={index}
                                    type="keywords"
                                    filter={keyword}
                                    onClick={() => removeFilter("keywords", keyword)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Price-based filtering */}
            <div className="form-field">
                <label id="price"> Price </label>
                <div className="flex gap-3">
                    {/* Minimum price boundary (inclusive) */}
                    <div className="w-1/2 flex flex-col gap-2">
                        <input
                            className={`form-input !py-1 w-full ${invalid.minPrice && "invalid"}`}
                            name="minPrice"
                            placeholder="Min"
                            onChange={handleChange}
                            value={input.minPrice}
                            ref={minPriceRef}
                        />
                        {filters.minPrice !== 0 &&
                                <FilterButton
                                    filter={"$ " + filters.minPrice.toString()}
                                    onClick={() => removeFilter("minPrice", 0)}
                                />
                        }
                    </div>
                    {/* Maximum price boundary (inclusive) */}
                    <div className="w-1/2 flex flex-col gap-2">
                        <input
                            className={`form-input !py-1 w-full ${invalid.maxPrice && "invalid"}`}
                            name="maxPrice"
                            placeholder="Max"
                            onChange={handleChange}
                            value={input.maxPrice}
                            ref={maxPriceRef}
                        />
                        {filters.maxPrice !== Infinity &&
                            <FilterButton
                                filter={"$ " + filters.maxPrice.toString()}
                                onClick={() => removeFilter("maxPrice", Infinity)}
                            />
                        }
                    </div>
                </div>
            </div>
            {/* Discount-based filtering */}
            <div className="flex gap-3 items-center">
                <label id="discounted"> Discounted? </label>
                <ToggleSlider
                    active={filters.discountOnly}
                    onToggle={toggleDiscountFilter}
                    transitionDuration="200ms"
                    draggable={false}
                    barBackgroundColorActive="#A61657"
                    barBackgroundColor="#003049"
                    barStyles={{outline: "1px solid #669bbc"}}
                    barStylesActive={{outline: "1px solid #A61657"}}
                />
            </div>
            <div className="w-full flex gap-2 mt-2">
                {/* Allows user to apply new filters, i.e., further narrow results */}
                <button
                    type="submit"
                    className="btn-primary w-1/2 !py-1.5 !text-base"
                    disabled={(input.keywords === "" && input.minPrice === "" && input.maxPrice === "" && input.discountOnly === filters.discountOnly) || invalid.minPrice || invalid.maxPrice }
                >
                    Apply
                </button>
                {/* Allows user to reset all currently active filters, i.e., view all listings */}
                <button
                    type="button"
                    className="btn-primary w-1/2 !py-1.5 !text-base"
                    onClick={resetFilters}
                >
                    Reset
                </button>
            </div>
        </form>
    );
}