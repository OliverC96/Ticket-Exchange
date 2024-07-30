import { parseDate } from "../../utils/parse_date";

export default function Metadata({ orderID }) {
    const { month, date, year } = parseDate();
    return (
        <div id="metadata" className="flex justify-between">
            <h3> { month } { date }, { year } </h3>
            <h3> #{orderID} </h3>
        </div>
    );
}