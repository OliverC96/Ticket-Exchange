import StatusMessage from "./StatusMessage";
import Metadata from "./Metadata";
import CostSummary from "./CostSummary";
import BillingDetails from "./BillingDetails";
import {
    getTaxAmount,
    getTotal
} from "../../utils/calculate_charges";

export default function OrderConfirmed({ order, customer }) {
    const { id, ticket, taxPercent, discount, status } = order;
    const taxAmount = getTaxAmount(ticket.price, taxPercent);
    const total = getTotal(ticket.price, taxAmount, discount).toFixed(2);
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
        }
    ];
    return (
        <div className="flex flex-col gap-5 p-5">
            <Metadata orderID={id} />
            <StatusMessage status={status} firstName={customer.name.split(" ")[0]} title={ticket.title} />
            <CostSummary charges={charges} total={total} />
            <BillingDetails {...customer} />
        </div>
    );
}