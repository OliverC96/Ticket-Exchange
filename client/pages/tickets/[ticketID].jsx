import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { TbReceiptDollar } from "react-icons/tb";
import posthog from "posthog-js";

// Displays all information corresponding to the selected ticket
const ViewTicket = ({ ticket }) => {

    // POST /api/orders
    const { performRequest, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: { ticketID: ticket.id },
        onSuccess: async (order) => {
            posthog.capture("order_created", {
                order
            });
            await Router.push(`/orders/${order.id}`);
        }
    });

    async function handleSubmission(event) {
        event.preventDefault();
        await performRequest();
    }

    return (
        <div className="page-wrapper">
            <div className="card p-8 w-1/3 -mt-36">
                <form className="flex flex-col gap-5" onSubmit={handleSubmission} >

                    <div className="flex items-center justify-between">
                        <h1 className="font-bold text-2xl">
                            Purchase a ticket
                        </h1>
                        <TbReceiptDollar className="text-3xl" />
                    </div>

                    <div className="form-field text-lg" >
                        <p> Title: { ticket.title } </p>
                    </div>

                    <div className="form-field text-lg" >
                        <p> Price: ${ ticket.price } CAD </p>
                    </div>

                    {/* Displays any errors encountered during the server-side request */}
                    { errors &&
                        <ul className="card-error" >
                            { errors.map((err) => (
                                <li key={err.message} > { err.message } </li>
                            ))}
                        </ul>
                    }

                    <button className="btn-primary mt-2" type="submit">
                        Purchase
                    </button>

                </form>
            </div>
        </div>
    );
};

// Fetch the desired ticket upon initial page load, and subsequent client-side navigations
ViewTicket.getInitialProps = async (context, client) => {
    const { ticketID } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketID}`);
    return { ticket: data };
}

export default ViewTicket;