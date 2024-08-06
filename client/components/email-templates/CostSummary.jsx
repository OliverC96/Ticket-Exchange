import Charge from "./Charge";
import { Section, Text } from "@react-email/components";

export default function CostSummary({ charges, forEmail }) {
    const total = charges[charges.length - 1];
    if (!forEmail) {
        return (
            <div className="flex flex-col gap-3">
                <h1 className="text-xl"> Order Summary </h1>
                <div className="flex flex-col gap-0.5">
                    {
                        charges.slice(0, -1).map((charge) => (
                            <Charge
                                key={charge.type}
                                { ...charge }
                            />
                        ))
                    }
                    <Charge { ...total } />
                </div>
            </div>
        );
    }
    return (
        <Section className="flex flex-col gap-3">
            <Text className="text-xl"> Order Summary </>
            <Section className="flex flex-col gap-0.5">
                {
                    charges.slice(0, -1).map((charge) => (
                        <Charge
                            key={charge.type}
                            forEmail={forEmail}
                            { ...charge }
                        />
                    ))
                }
                <Charge { ...total } />
            </Section>
        </Section>
    )
};