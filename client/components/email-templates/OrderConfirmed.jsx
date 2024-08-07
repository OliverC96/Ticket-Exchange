import StatusMessage from "./StatusMessage";
import Metadata from "./Metadata";
import CostSummary from "./CostSummary";
import BillingDetails from "./BillingDetails";
import { getCharges } from "../../utils/calculate_charges";
import {
    Body,
    Html,
    Tailwind
} from "@react-email/components";

export default function OrderConfirmed({ order, customer }) {
    const { id, ticket, taxPercent, discount, status } = order;
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                blue: {
                                    xlight: "#E0F4FF",
                                    dark: "#003049",
                                    xxdark: "#001B29"
                                }
                            }
                        }
                    }
                }}
            >
                <Body className="p-6 bg-blue-dark text-blue-xlight">
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
                        forEmail={true}
                    />
                </Body>
            </Tailwind>
        </Html>
    );
}