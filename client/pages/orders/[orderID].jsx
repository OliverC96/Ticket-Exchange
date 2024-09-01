import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import { appearanceOptions } from "../../styles/stripe-form";

// Displays the secure checkout form (provided by StripeJS)
const ViewOrder = ({ order, currentUser }) => {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY_PUBLISHABLE);
    return (
        <Elements stripe={stripePromise} options={appearanceOptions}>
            <CheckoutForm order={order} currentUser={currentUser} />
        </Elements>
    );
};

// Fetch the related order upon initial page load, and subsequent client-side navigations
ViewOrder.getInitialProps = async (context, client) => {
    const { orderID } = context.query;
    const { data } = await client.get(`/api/orders/${orderID}`);
    return {
        order: data
    };
}

export default ViewOrder;