export default function BillingDetails({ name, address }) {
    const { line1, line2, city, state, country, postal_code } = address;
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