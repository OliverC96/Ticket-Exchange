// Encapsulates a single charge
export default function Charge({ type, amount, forEmail }) {
    // Browser UI
    if (!forEmail) {
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
    // Email UI
    return (
        <div className={`flex -mt-5 justify-between ${type === "Order Total" && "text-lg font-bold"}`}>
            <p> { type }: </p>
            {
                (type === "Discount" || type === "Refund")
                    ? <p className="opacity-80"> -${ amount } CAD </p>
                    : <p className={`${type !== "Order Total" && "opacity-80"}`}> ${ amount } CAD </p>
            }
        </div>
    );
}