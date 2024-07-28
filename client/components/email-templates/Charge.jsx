export default function Charge({ type, amount }) {
    return (
        <div className="flex justify-between">
            <p> { type }: </p>
            {
                (type === "Discount" || type === "Refund")
                    ? <p> -${ amount } CAD </p>
                    : <p> ${ amount } CAD </p>
            }
        </div>
    );
}