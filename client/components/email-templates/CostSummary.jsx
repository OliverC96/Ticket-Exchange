import Charge from "./Charge";

export default function CostSummary({ charges, forEmail }) {
    const total = charges[charges.length - 1];
    if (!forEmail) {
        return (
            <div className="flex flex-col gap-3">
                <h1 className="text-xl font-bold"> Order Summary </h1>
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
        <div className="mt-10">
            <p className="text-xl font-bold"> Order Summary </p>
            <div className="bg-blue-xxdark px-7 pt-7 rounded-md outline outline-1 outline-blue-xlight">
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
            </div>
        </div>
    )
};