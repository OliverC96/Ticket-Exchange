import useFilter from "../hooks/use-form-input/filter";
import FilterButton from "../components/FilterButton";
import { useRef } from "react";
import { FaCodeBranch } from "react-icons/fa6";

export default function FilterForm({ tickets, setTickets, resetSortingOptions }) {
    const minPriceRef = useRef(null);
    const maxPriceRef = useRef(null);
    const {
        input,
        filters,
        handleChange,
        onBlur,
        handleSubmission,
        removeFilter,
        resetFilters
    } = useFilter({
        minPriceRef,
        maxPriceRef,
        tickets,
        setTickets,
        resetSortingOptions
    });
    return (
        <form
            className="bg-inherit text-blue-xlight mt-32 py-2 px-5 h-fit w-1/5 text-lg flex flex-col gap-5"
            onSubmit={handleSubmission}
        >
            <div className="flex gap-3">
                <FaCodeBranch size={25}/>
                <p className="text-xl"> Filter Results </p>
            </div>
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
            <div className="form-field">
                <label id="price"> Price </label>
                <div className="flex gap-3">
                    <div className="w-1/2 flex flex-col gap-2">
                        <input
                            className="form-input !py-1 w-full"
                            name="minPrice"
                            placeholder="Min"
                            onChange={handleChange}
                            onBlur={onBlur}
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
                    <div className="w-1/2 flex flex-col gap-2">
                        <input
                            className="form-input !py-1 w-full"
                            name="maxPrice"
                            placeholder="Max"
                            onChange={handleChange}
                            onBlur={onBlur}
                            value={input.maxPrice}
                            ref={maxPriceRef}
                        />
                        {filters.maxPrice !== 0 &&
                            <FilterButton
                                filter={"$ " + filters.maxPrice.toString()}
                                onClick={() => removeFilter("maxPrice", 0)}
                            />
                        }
                    </div>
                </div>
            </div>
            <div className="w-full flex gap-2 mt-2">
                <button
                    type="submit"
                    className="btn-primary w-1/2 !py-1.5 !text-base"
                    disabled={input.keywords === "" && input.minPrice === "" && input.maxPrice === ""}
                >
                    Apply
                </button>
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