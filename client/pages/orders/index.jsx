import Order from "../../components/Order";
import TicketDecal from "../../components/TicketDecal";

// Displays all orders associated with the current user (irrespective of their status)
const OrderIndex = ({ orders, currentUser }) => {
    return (
        <div className="flex p-8 justify-evenly h-screen -mt-[10vh] bg-blue-dark">
            <div className="order-grid">
                { orders.length > 0
                    ?
                        orders.map((order) => {
                            return <Order key={order.id} currentUser={currentUser} {...order} />;
                        })
                    :
                        <p> You have no prior orders. </p>
                }
            </div>
            <TicketDecal />
        </div>
    );
}

// Fetch order history upon initial page load, and subsequent client-side navigations
OrderIndex.getInitialProps = async (context, client) => {
    const { data } = await client.get("/api/orders");
    return { orders: data };
}

export default OrderIndex;