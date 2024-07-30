import StatusMessage from "./StatusMessage";
import Metadata from "./Metadata";
import CostSummary from "./CostSummary";
import { getCharges } from "../../utils/calculate_charges";

export default function OrderRefunded({ order, customer }) {
    const { id, ticket, taxPercent, discount, status } = order;
    return (
        <div className="flex flex-col gap-5 p-5">
            <Metadata orderID={id} />
            <StatusMessage status={status} firstName={customer.name.split(" ")[0]} title={ticket.title} />
            <CostSummary charges={getCharges(ticket.price, taxPercent, discount, true)} />
        </div>
    );
}