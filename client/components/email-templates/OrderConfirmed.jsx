import StatusMessage from "./StatusMessage";
import Metadata from "./Metadata";
import CostSummary from "./CostSummary";
import BillingDetails from "./BillingDetails";
import ChargeManager from "../../utils/ChargeManager";
import {
    Body,
    Html,
    Tailwind
} from "@react-email/components";

// Template for order confirmation email
export default function OrderConfirmed({ order, customer }) {
    const { id, ticket, discount, status, timestamp } = order;
    const provinceCode = customer.address.state;
    const chargeManager = new ChargeManager(
        ticket.price,
        discount,
        provinceCode,
        true,
        false
    );

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
                    <Metadata
                        orderID={id}
                        d={timestamp}
                    />
                    <StatusMessage
                        status={status}
                        firstName={customer.name.split(" ")[0]}
                        title={ticket.title}
                    />
                    <CostSummary
                        charges={chargeManager.getCharges()}
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