import Charge from "./Charge";

export default function CostSummary({ charges, total }) {
    return (
        <div className="flex flex-col gap-3">
            <h1 className="text-xl"> Order Summary </h1>
            <div className="flex flex-col gap-0.5">
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
        </div>
    )
};