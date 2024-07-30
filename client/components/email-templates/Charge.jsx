export default function Charge({ type, amount }) {
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