import { HiOutlineReceiptRefund } from "react-icons/hi";
import useRequest from "../hooks/use-request";
import Router from "next/router";

export default function Order({ status, ticket, id }) {

    const { performRequest, errors } = useRequest({
        url: `/api/orders/${id}`,
        method: "patch",
        body: {},
        onSuccess: () => Router.push("/orders")
    });

    const processRefund = async () => {
        await performRequest();
    };

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
        <div className="flex flex-col gap-2 rounded-lg p-5 outline outline-1 outline-blue-light bg-blue-xxdark h-fit">
            <div className="flex justify-between">
                <h1 className="text-xl"> { ticket.title } </h1>
                { status === "complete" &&
                    <HiOutlineReceiptRefund
                        className="text-2xl hover:cursor-pointer hover:text-orange-300 transition duration-100"
                        onClick={processRefund}
                    />
                }
            </div>
            <ul className="list-disc list-inside text-base">
                <li> Ticket Price: ${ ticket.price } CAD </li>
                <li> Order ID: { id } </li>
                <li> Order Status: <span className={`${getStatusColour(status)}`}> { status } </span> </li>
                { errors }
            </ul>
        </div>
    );

}