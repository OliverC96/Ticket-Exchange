import Order from "../../components/Order";
import { LuTicket } from "react-icons/lu";
import { BsTicketPerforatedFill} from "react-icons/bs";
import { FaTicket } from "react-icons/fa6";

const OrderIndex = ({ orders }) => {
    return (
        <div className="h-screen bg-blue-dark flex p-8 justify-evenly">
            <div className="grid grid-cols-2 gap-5 text-lg text-blue-xlight w-fit h-fit">
                { orders.map((order) => {
                    return <Order key={order.id} {...order} />;
                })}
            </div>
            <div className="text-blue-light flex flex-col gap-10 opacity-90">
                <LuTicket className="rotate-45 hover:rotate-[65deg] transition duration-300" size={120} />
                <BsTicketPerforatedFill className="-rotate-45 hover:-rotate-[60deg] transition duration-300" size={120} />
                <FaTicket className="rotate-45 hover:rotate-[65deg] transition duration-300" size={120} />
            </div>
        </div>
    );
}

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get("/api/orders");
    return { orders: data };
}

export default OrderIndex;