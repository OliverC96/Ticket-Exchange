import { TbReload } from "react-icons/tb";

export default function ReloadButton({ onClick }) {
    return (
        <div
            className="sort-btn icon-btn justify-center hover:cursor-pointer"
            onClick={onClick}
        >
            <TbReload className="text-xl"/>
            <p> Reload </p>
        </div>
    );
}