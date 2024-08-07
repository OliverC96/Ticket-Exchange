import { parseDate } from "../../utils/parse_date";

export default function Metadata({ orderID }) {
    const d = parseDate();
    return (
        <div className="text-center text-lg font-bold">
            <p> Order #{orderID} </p>
            <p className="-mt-3"> {d.day} {d.date} {d.month} {d.year} @ {d.hours}:{d.minutes} {d.tag} </p>
        </div>
    );
}