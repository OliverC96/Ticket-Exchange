import { HiOutlineReceiptRefund } from "react-icons/hi";
import useRequest from "../hooks/use-request";
import Router from "next/router";
import { usePostHog } from "posthog-js/react";
import { parseDate } from "../utils/parse_date";

// Encapsulates a single order document
export default function Order({ status, ticket, id, currentUser }) {

    const posthog = usePostHog();

    // PATCH /api/orders
    const { performRequest, errors } = useRequest({
        url: `/api/orders/${id}`,
        method: "patch",
        body: {},
        onSuccess: (order) => {
            posthog?.capture("order_refunded", {
                id: order.id,
                ticketID: order.ticket.id
            });
            Router.reload();
        }
    });

    // Handle order refund request
    const processRefund = async () => {
        const { id, ticket, discount } = JSON.parse(localStorage.getItem("order"));
        const { name, address } = JSON.parse(localStorage.getItem("customer"));

        // Initiate email update to notify current user of the successful refund operation
        await fetch(
            "/api/send-update",
            {
                method: "POST",
                body: JSON.stringify({
                    order: {
                        id,
                        ticket,
                        discount,
                        status: "refunded",
                        timestamp: parseDate()
                    },
                    customer: {
                        name,
                        address,
                        email: currentUser.email
                    }
                })
            }
        );

        posthog?.capture("email_sent", {
            recipientEmail: currentUser.email,
            type: "order_refunded",
            subject: "Order Refunded"
        });

        await performRequest(); // Soft delete the order from the server-side database
    };

    // Maps order status to text colour
    const getStatusColour = (currStatus) => {
        switch (currStatus) {
            case "created":
                return "text-blue-xlight";
            case "cancelled":
                return "text-red-400";
            case "complete":
                return "text-green-400";
            case "awaiting:payment":
            case "refunded":
                return "text-orange-300";
        }
    };

    return (
        <div className="flex flex-col gap-2 rounded-lg p-5 outline outline-1 outline-blue-light bg-blue-xxdark h-fit w-fit">
            <div className="flex justify-between">
                <h1 className="text-xl"> { ticket.title } </h1>
                {/* Display order refund icon when applicable */}
                { status === "complete" &&
                    <HiOutlineReceiptRefund
                        className="text-2xl hover:cursor-pointer hover:text-orange-300 transition duration-100"
                        onClick={processRefund}
                    />
                }
            </div>
            {/* Display order information */}
            <ul className="list-disc list-inside text-base">
                <li> Ticket Price: ${ ticket.price } CAD </li>
                <li> Order ID: { id } </li>
                <li> Order Status: <span className={`${getStatusColour(status)}`}> { status } </span> </li>
                {/* Display any errors encountered during the refund process */}
                { errors &&
                    <ul className="card-error" >
                        { errors.map((err) => (
                            <li key={err.message} > { err.message } </li>
                        ))}
                    </ul>
                }
            </ul>
        </div>
    );

}