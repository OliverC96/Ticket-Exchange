import { Section, Text } from "@react-email/components";

export default function StatusMessage({ status, firstName, title }) {
    return (
        <Section className="flex flex-col gap-2">
            <Text>
                { status === "complete"
                    ? `Thanks, ${firstName}!`
                    : `${firstName},`
                }
            </Text>
            <Text>
                { status === "complete"
                    ? "Your order was successfully processed."
                    : "Your order has been refunded."
                }
            </Text>
            <Text>
                - 1 { title } Ticket
            </Text>
        </Section>
    );
}