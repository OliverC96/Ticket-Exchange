import { IoClose } from "react-icons/io5";

// Filter button component (allowing users to view and/or delete current filters)
export default function FilterButton({ filter, onClick }) {
    return (
        <div
            className="sort-btn icon-btn justify-center sort-enabled !py-0 !w-fit hover:cursor-pointer"
        >
            { filter }
            <IoClose onClick={onClick} />
        </div>
    );
}