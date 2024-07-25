import { getStatusColour } from "../styles/order";

export default function Order({ status, ticket, id }) {
    return (
        <div className="flex flex-col gap-2 rounded-lg p-5 outline outline-1 outline-blue-light bg-blue-xxdark h-fit">
            <h1 className="text-xl"> { ticket.title } </h1>
            <ul className="list-disc list-inside text-base">
                <li> Ticket Price: ${ ticket.price } CAD </li>
                <li> Order ID: { id } </li>
                <li> Order Status: <span className={getStatusColour(status)}> { status } </span> </li>
            </ul>
        </div>
    );
}