export default function BillingDetails({ name, address, forEmail }) {
    const { line1, line2, city, state, country, postal_code } = address;
    const sectionContent = [
        name,
        <br />,
        line1,
        <br />,
        line2 && line2,
        line2 && <br />,
        city + ", " + state + " " + postal_code,
        <br />,
        country
    ];
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
        <div className="mt-10">
            <p className="text-xl font-bold"> Billing Details </p>
            <div className="bg-blue-xxdark rounded-md p-7 outline outline-1 outline-blue-xlight">
                { sectionContent }
            </div>
        </div>
    );
}