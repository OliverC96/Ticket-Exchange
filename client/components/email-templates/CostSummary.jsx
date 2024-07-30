import Charge from "./Charge";

export default function CostSummary({ charges }) {
    const total = charges[charges.length - 1];
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
    )
};