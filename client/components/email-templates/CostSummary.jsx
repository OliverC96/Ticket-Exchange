import Charge from "./Charge";

export default function CostSummary({ charges, total }) {
    return (
        <div id="cost-summary" className="flex flex-col gap-5">
            {
                charges.map((charge) => (
                    <Charge
                        key={charge.type}
                        { ...charge }
                    />
                ))
            }
            <Charge type="Order Total" amount={total} />
        </div>
    )
};