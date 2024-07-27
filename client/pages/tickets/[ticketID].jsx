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
        <div className="bg-blue-dark h-screen -mt-[10vh] flex flex-col pt-32 items-center text-blue-xlight">
            <div className="bg-blue-xxdark flex flex-col p-8 rounded-lg outline outline-1 outline-blue-light w-1/3">
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

                    { errors }

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