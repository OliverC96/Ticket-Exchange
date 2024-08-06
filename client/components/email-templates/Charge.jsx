import { Section, Text } from "@react-email/components";

export default function Charge({ type, amount, forEmail }) {
    if (!forEmail) {
        return (
            <div className={`flex justify-between ${type === "Order Total" && "text-lg"}`}>
                <p> { type }: </p>
                {
                    (type === "Discount" || type === "Refund")
                        ? <p className="opacity-80"> -${ amount } CAD </p>
                        : <p className={`${type !== "Order Total" && "opacity-80"}`}> ${ amount } CAD </p>
                }
            </div>
        );
    }
    return (
        <Section className={`flex justify-between ${type === "Order Total" && "text-lg"}`}>
            <Text> { type }: </Text>
            {
                (type === "Discount" || type === "Refund")
                    ? <Text className="opacity-80"> -${ amount } CAD </Text>
                    : <Text className={`${type !== "Order Total" && "opacity-80"}`}> ${ amount } CAD </Text>
            }
        </Section>
    );
}