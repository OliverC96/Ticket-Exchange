import StatusMessage from "./StatusMessage";
import Metadata from "./Metadata";
import CostSummary from "./CostSummary";
import {
    getTaxAmount,
    getTotal
} from "../../utils/calculate_charges";

export default function OrderRefunded({ order, customer }) {
    const { id, ticket, taxPercent, discount, status } = order;
    const taxAmount = getTaxAmount(ticket.price, taxPercent);
    const refundAmount = getTotal(ticket.price, taxAmount, discount);
    const charges = [
        {
            type: "Ticket Price",
            amount: ticket.price.toFixed(2)
        },
        {
            type: `Tax (${taxPercent}%)`,
            amount: taxAmount.toFixed(2)
        },
        {
            type: "Discount",
            amount: discount.toFixed(2)
        },
        {
            type: "Refund",
            amount: refundAmount.toFixed(2)
        }
    ];
    return (
        <div className="flex flex-col gap-5 p-5">
            <Metadata orderID={id} />
            <StatusMessage status={status} firstName={customer.name.split(" ")[0]} title={ticket.title} />
            <CostSummary charges={charges} total={0.00} />
        </div>
    );
}