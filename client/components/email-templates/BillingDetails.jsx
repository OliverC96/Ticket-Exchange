import { Section, Text } from "@react-email/components";

export default function BillingDetails({ name, address, forEmail }) {
    const { line1, line2, city, state, country, postal_code } = address;
    if (!forEmail) {
        return (
            <div className="flex flex-col gap-3">
                <h1 className="text-xl"> Billing Details </h1>
                <div className="flex flex-col gap-0.5">
                    <p> { name } </p>
                    <p> { line1 } </p>
                    { line2 && <p> { line2 } </p>}
                    <p> { city }, { state } { postal_code } </p>
                    <p> { country } </p>
                </div>
            </div>
        );
    }
    return (
        <Section className="flex flex-col gap-3">
            <Text className="text-xl"> Billing Details </Text>
            <Section className="flex flex-col gap-0.5">
                <Text> { name } </Text>
                <Text> { line1 } </Text>
                { line2 && <Text> { line2 } </Text>}
                <Text> { city }, { state } { postal_code } </Text>
                <Text> { country } </Text>
            </Section>
        </Section>
    );
}