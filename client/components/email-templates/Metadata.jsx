import { parseDate } from "../../utils/parse_date";
import { Section, Text } from "@react-email/components";

export default function Metadata({ orderID }) {
    const { month, date, year } = parseDate();
    return (
        <Section className="flex justify-between">
            <Text> { month } { date }, { year } </Text>
            <Text> #{orderID} </Text>
        </Section>
    );
}