import useRequest from "../hooks/use-request";
import Router from "next/router";
import { useState, useEffect } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    AddressElement
} from "@stripe/react-stripe-js";
import { elementStyle } from "../styles/stripe-form";
import { FaRegCreditCard } from "react-icons/fa";
import { addressOptions, countryMapping } from "../utils/address_config";
import { ThreeDots } from "react-loader-spinner";

// Checkout form component; allows users to securely purchase a listing via the StripeJS API
export default function CheckoutForm({ order, currentUser }) {

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [tokenID, setTokenID] = useState("");
    const [loading, setLoading] = useState(false);

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

    const stripe = useStripe();
    const elements = useElements();

    // Initiate the backend request upon token creation (i.e., when a valid token ID is defined)
    useEffect(() => {
        if (tokenID !== "") {
            performRequest();
        }
    }, [tokenID]);

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

            const { name, address } = billingDetails.value;
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
                            taxPercent: 5,
                            discount: 0,
                            status: "complete"
                        },
                        customer: {
                            name,
                            address
                        }
                    })
                }
            );

            // Persist order and customer details via browser local storage
            localStorage.setItem("order", JSON.stringify({
                ...order,
                taxPercent: 5,
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

        }

    }

    // Display the order expiration window countdown (updated every second)
    useEffect(() => {
        const getTimeRemaining = () => {
            const timeRemainingMS = new Date(order.expiresAt) - new Date();
            setTimeRemaining(Math.round(timeRemainingMS / 1000));
        };
        getTimeRemaining();
        const timerID = setInterval(getTimeRemaining, 1000);
        return () => {
            clearInterval(timerID); // Clear the interval on component unmount
        };
    }, [order]);

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
                        Purchase <i>{ order.ticket.title  }</i> - ${ order.ticket.price  } CAD
                    </h1>
                </div>

                {/* Secure checkout form */}
                <form className="flex gap-5" onSubmit={handleSubmission}>

                    {/* Billing address */}
                    <AddressElement options={addressOptions} className="w-3/5" />

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
                                <CardNumberElement className="form-input" options={elementStyle} />
                            </div>

                            <div className="flex justify-between">
                                <div className="form-field w-[48%]" id="expiryDate">
                                    <label>
                                        Expiry Date
                                    </label>
                                    <CardExpiryElement className="form-input" options={elementStyle} />
                                </div>
                                <div className="form-field w-[48%]" id="securityCode">
                                    <label>
                                        Security Code
                                    </label>
                                    <CardCvcElement className="form-input" options={elementStyle} />
                                </div>
                            </div>
                        </div>

                        {/* Displays any errors encountered during the payment process */}
                        { errors &&
                            <ul className="card-error" >
                                { errors.map((err) => (
                                    <li key={err.message} > { err.message } </li>
                                ))}
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