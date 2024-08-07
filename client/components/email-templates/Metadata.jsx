import { parseDate } from "../../utils/parse_date";

export default function Metadata({ orderID }) {
    const { month, date, year } = parseDate();
    return (
        <div className="flex justify-between">
            <p> { month } { date }, { year } </p>
            <p> #{orderID} </p>
        </div>
    );
}