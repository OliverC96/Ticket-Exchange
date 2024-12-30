import { useState, useEffect } from "react";
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    AddressElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { elementStyle } from "../styles/stripe-form";
import { FaRegCreditCard } from "react-icons/fa";
import { addressOptions, countryMapping } from "../utils/address_config";
import { ThreeDots } from "react-loader-spinner";
import useRequest from "../hooks/use-request";
import useExpiration from "../hooks/use-expiration";
import Router from "next/router";
import { usePostHog } from "posthog-js/react";

// Checkout form component; allows users to securely purchase a listing via the StripeJS API
export default function CheckoutForm({ order, currentUser }) {

    const [loading, setLoading] = useState(false);
    const [tokenID, setTokenID] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // Client-side error tracking

    const stripe = useStripe();
    const elements = useElements();
    const posthog = usePostHog();

    // 15-minute order expiration timer
    const { timeRemaining } = useExpiration({ order });

    // POST /api/payments
    const { performRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            tokenID,
            orderID: order.id
        },
        onSuccess: async () => {
            setLoading(false);
            await Router.push("/orders/complete");
        }
    });

    // Initiate the backend request upon token creation (i.e., when a valid token ID is defined)
    useEffect(() => {
        if (tokenID !== "") {
            performRequest();
        }
    }, [tokenID]);

    useEffect(() => {
        if ((errors) || (errorMessage !== "")) {
            setLoading(false);
        }
    }, [errors]);

    async function handleSubmission(event) {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        // Access the secure Stripe components
        const card = elements.getElement(CardNumberElement);
        const address = elements.getElement(AddressElement);
        const billingDetails = await address.getValue();
        if (billingDetails.complete) {

            const { name, address} = billingDetails.value;
            address.country = countryMapping[address.country]; // Convert ISO Alpha-2 country code to full country name

            // Initiate order confirmation email update
            await fetch(
                "/api/send-confirmation",
                {
                    method: "POST",
                    body: JSON.stringify({
                        order: {
                            id: order.id,
                            ticket: order.ticket,
                            discount: 0,
                            status: "complete"
                        },
                        customer: {
                            name,
                            address,
                            email: currentUser.email
                        }
                    })
                }
            );

            // Persist order and customer details via browser local storage
            localStorage.setItem("order", JSON.stringify({
                ...order,
                discount: 0
            }));
            localStorage.setItem("customer", JSON.stringify({
                name,
                email: currentUser.email,
                address
            }));

            // Create a Stripe token using the provided payment information
            const res = await stripe.createToken(card);

            // Update the token ID upon successful token creation
            if (res.token) {
                setTokenID(res.token.id);
            }
            else {
                posthog?.capture("payment_failed", {
                    orderID: order.id,
                    errorCode: res.error.code,
                    errorMessage: res.error.message,
                    errorType: res.error.type
                });
                setErrorMessage(`Payment failed - ${res.error.message}`);
            }

        }
    }

    return (
        <div className="page-wrapper">
            <div className="card gap-5 p-8 w-[60%]">
                <div className="flex flex-col gap-2 items-center">
                    {/* Order expiration window countdown */}
                    {
                        timeRemaining > 0
                            ? <h3 className="text-blue-xlight text-lg"> Time Remaining: { timeRemaining }s </h3>
                            : <h3 className="text-red-400 text-lg"> Order Expired </h3>
                    }
                    {/* Order summary */}
                    <h1 className="text-2xl font-bold">
                        Purchase <i>{ order.ticket.title }</i> - ${ order.ticket.price } CAD
                    </h1>
                </div>

                {/* Secure checkout form */}
                <form className="flex gap-5" onSubmit={handleSubmission}>

                    {/* Billing address */}
                    <AddressElement options={addressOptions} className="w-3/5 ph-no-capture" />

                    <div className="vertical-line" />

                    {/* Credit card payment information */}
                    <div className="w-2/5 flex flex-col gap-5 justify-between">

                        <div className="flex flex-col gap-3">
                            <div className="form-field">
                                <label>
                                    Email Address
                                </label>
                                <input
                                    className="form-input !py-1.5"
                                    value={currentUser.email}
                                    disabled
                                />
                            </div>

                            <div className="form-field" id="cardNumber">
                                <label className="flex justify-between items-center">
                                    Card Number
                                    <FaRegCreditCard />
                                </label>
                                <CardNumberElement className="form-input ph-no-capture" options={elementStyle} />
                            </div>

                            <div className="flex justify-between">
                                <div className="form-field w-[48%]" id="expiryDate">
                                    <label>
                                        Expiry Date
                                    </label>
                                    <CardExpiryElement className="form-input ph-no-capture" options={elementStyle} />
                                </div>
                                <div className="form-field w-[48%]" id="securityCode">
                                    <label>
                                        Security Code
                                    </label>
                                    <CardCvcElement className="form-input ph-no-capture" options={elementStyle} />
                                </div>
                            </div>
                        </div>

                        {/* Displays any server-side errors encountered during the payment process */}
                        { errors &&
                            <ul className="card-error">
                                { errors.map((err) => (
                                    <li key={err.message} > { err.message } </li>
                                ))}
                            </ul>
                        }

                        {/* Displays any client-side errors encountered during the payment process */}
                        { errorMessage !== "" &&
                            <ul className="card-error">
                                <li> { errorMessage } </li>
                            </ul>
                        }

                        {/* Form submission button */}
                        <button
                            className="btn-primary mb-1 icon-btn justify-center"
                            type="submit"
                            disabled={!stripe || !elements}
                        >
                            Buy now
                            {/* Display the loading spinner when applicable */}
                            <ThreeDots visible={loading} height={10} width={30} color="#E0F4FF" />
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}