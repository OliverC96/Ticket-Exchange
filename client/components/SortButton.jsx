import {
    FaSortUp,
    FaSortDown
} from "react-icons/fa6";

// Represents a single sorting option (e.g., price-based sorting, title-based sorting)
export default function SortButton({ type, isAscending, isEnabled, toggleDirection }) {
    return (
        <button
            className={`sort-btn icon-btn justify-center w-[14%] ${isEnabled && "sort-enabled"}`}
            onClick={toggleDirection}
        >
            { type }
            {
                isAscending
                    ? <FaSortUp className={`${!isEnabled && "hidden"}`} />
                    : <FaSortDown className={`${!isEnabled && "hidden"}`} />
            }
        </button>
    );
}