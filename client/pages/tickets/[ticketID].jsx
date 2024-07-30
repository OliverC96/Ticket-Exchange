import useRequest from "../../hooks/use-request";
import Router from "next/router";
import { TbReceiptDollar } from "react-icons/tb";

const ViewTicket = ({ ticket }) => {

    const { performRequest, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: { ticketID: ticket.id },
        onSuccess: (order) => Router.push(`/orders/${order.id}`)
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

ViewTicket.getInitialProps = async (context, client) => {
    const { ticketID } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketID}`);
    return { ticket: data };
}

export default ViewTicket;