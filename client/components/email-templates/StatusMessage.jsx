export default function StatusMessage({ status, firstName, title }) {
    return (
        <div className="flex flex-col bg-blue-xxdark px-7 py-4 rounded-md outline outline-1 outline-blue-xlight">
            <p className="opacity-80">
                { status === "complete"
                    ? `Thanks, ${firstName}!`
                    : `${firstName},`
                }
            </p>
            <p className="text-xl -mt-3">
                { status === "complete"
                    ? "Your order was successfully processed."
                    : "Your order has been refunded."
                }
            </p>
            <p className="-mt-3 opacity-80">
                - 1 { title } Ticket
            </p>
        </div>
    );
}