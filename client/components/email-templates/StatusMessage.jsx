export default function StatusMessage({ status, firstName, title }) {
    return (
        <div id="status-msg" className="flex flex-col gap-2">
            <h3>
                { status === "complete"
                    ? `Thanks, ${firstName}!`
                    : `${firstName},`
                }
            </h3>
            <h1>
                { status === "complete"
                    ? "Your order was successfully processed."
                    : "Your order has been refunded."
                }
            </h1>
            <h2>
                - 1 { title } Ticket
            </h2>
        </div>
    );
}