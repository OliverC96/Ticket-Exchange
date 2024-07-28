import StatusMessage from "./StatusMessage";
import Metadata from "./Metadata";
import CostSummary from "./CostSummary";
import BillingDetails from "./BillingDetails";

export default function OrderConfirmation({ title, price, status, orderID, tax_percent, discount, customer }) {
    const tax_amt = (tax_percent / 100) * price;
    const total = (price + tax_amt).toFixed(2);
    const charges = [
        {
            type: "Ticket Price",
            amount: price.toFixed(2)
        },
        {
            type: `Tax (${tax_percent}%)`,
            amount: tax_amt.toFixed(2)
        },
        {
            type: "Discount",
            amount: discount
        }
    ];
    return (
        <div className="flex flex-col gap-5 p-5">
            <Metadata orderID={orderID} />
            <StatusMessage status={status} firstName={customer.name.split(" ")[0]} title={title} />
            <CostSummary charges={charges} total={total} />
            <BillingDetails {...customer} />
        </div>
    );
}