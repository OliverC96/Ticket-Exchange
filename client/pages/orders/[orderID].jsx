import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import { appearanceOptions } from "../../styles/stripe-form";

const ViewOrder = ({ order, currentUser, stripeKey, placesKey }) => {
    const stripePromise = loadStripe(stripeKey);
    return (
        <Elements stripe={stripePromise} options={appearanceOptions}>
            <CheckoutForm order={order} currentUser={currentUser} placesKey={placesKey} />
        </Elements>
    );
};

ViewOrder.getInitialProps = async (context, client) => {
    const { orderID } = context.query;
    const { data } = await client.get(`/api/orders/${orderID}`);
    return {
        order: data,
        stripeKey: process.env.STRIPE_PUBLISHABLE_KEY,
        placesKey: process.env.GOOGLE_PLACES_KEY
    };
}

export default ViewOrder;