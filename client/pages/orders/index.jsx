import Order from "../../components/Order";
import TicketDecal from "../../components/TicketDecal";

const OrderIndex = ({ orders }) => {
    return (
        <div className="flex p-8 justify-evenly h-screen -mt-[10vh] bg-blue-dark">
            <div className="grid grid-cols-2 gap-5 text-lg text-blue-xlight w-fit h-fit pt-24">
                { orders.map((order) => {
                    return <Order key={order.id} {...order} />;
                })}
            </div>
            <TicketDecal />
        </div>
    );
}

OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get("/api/orders");
    return { orders: data };
}

export default OrderIndex;