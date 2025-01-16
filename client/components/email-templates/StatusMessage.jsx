// Status message component notifying the user of a successful order/refund
export default function StatusMessage({ status, firstName, title }) {
    return (
        <div className="mt-8 bg-blue-xxdark px-7 py-4 rounded-md outline outline-1 outline-blue-xlight !text-blue-xlight">
            <p className="opacity-80">
                { status === "complete"
                    ? `Thanks, ${firstName}!`
                    : `${firstName},`
                }
            </p>
            <p className="text-2xl -mt-3 opacity-100">
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