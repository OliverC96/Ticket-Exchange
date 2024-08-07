import StatusMessage from "./StatusMessage";
import Metadata from "./Metadata";
import CostSummary from "./CostSummary";
import BillingDetails from "./BillingDetails";
import { getCharges } from "../../utils/calculate_charges";
import {
    Body,
    Html,
    Tailwind,
    Text
} from "@react-email/components";

export default function OrderConfirmed({ order, customer }) {
    const { id, ticket, taxPercent, discount, status } = order;
    return (
        <Html>
            <Tailwind>
                <Text className="text-red-500"> TEST </Text>
                <Body className="flex flex-col gap-5 p-5">
                    <Metadata orderID={id} />
                    <StatusMessage
                        status={status}
                        firstName={customer.name.split(" ")[0]}
                        title={ticket.title}
                    />
                    <CostSummary
                        charges={getCharges(ticket.price, taxPercent, discount, false)}
                        forEmail={true}
                    />
                    <BillingDetails
                        {...customer}
                        forEmail={false}
                    />
                </Body>
            </Tailwind>
        </Html>
    );
}