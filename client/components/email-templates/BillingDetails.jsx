export default function BillingDetails({ name, address }) {
    const { line1, line2, city, state, country, postal_code } = address;
    return (
        <div id="billing-details" className="flex flex-col gap-2">
            <p> { name } </p>
            <p> { line1 } </p>
            { line2 && <p> { line2 } </p>}
            <p> { city }, { state } { postal_code } </p>
            <p> { country } </p>
        </div>
    );
}