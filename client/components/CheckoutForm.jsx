import useRequest from "../hooks/use-request";
import Router from "next/router";
import { useState, useEffect, useRef } from "react";
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

export default function CheckoutForm({ order, currentUser }) {

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [tokenID, setTokenID] = useState("");
    const isFirstRender = useRef(true);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        performRequest();
    }, [tokenID]);

    async function handleSubmission(event) {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const card = elements.getElement(CardNumberElement);
        const address = elements.getElement(AddressElement);
        const billingDetails = await address.getValue();
        if (billingDetails.complete) {

            const { name, address } = billingDetails.value;
            address.country = countryMapping[address.country];

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

            const res = await stripe.createToken(card);
            if (res.token) {
                setTokenID(res.token.id);
            }

        }

    }

    useEffect(() => {
        const getTimeRemaining = () => {
            const timeRemainingMS = new Date(order.expiresAt) - new Date();
            setTimeRemaining(Math.round(timeRemainingMS / 1000));
        };
        getTimeRemaining();
        const timerID = setInterval(getTimeRemaining, 1000);
        return () => {
            clearInterval(timerID);
        };
    }, [order]);

    return (
        <div className="page-wrapper">
            <div className="card gap-5 p-8 w-[60%]">
                <div className="flex flex-col gap-2 items-center">
                    {
                        timeRemaining > 0
                            ? <h3 className="text-blue-xlight text-lg"> Time Remaining: { timeRemaining }s </h3>
                            : <h3 className="text-red-400 text-lg"> Order Expired </h3>
                    }
                    <h1 className="text-2xl font-bold">
                        Purchase <i>{ order.ticket.title  }</i> - ${ order.ticket.price  } CAD
                    </h1>
                </div>

                <form className="flex gap-5" onSubmit={handleSubmission}>

                    <AddressElement options={addressOptions} className="w-3/5" />

                    <div className="vertical-line" />

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

                        { errors &&
                            <ul className="card-error" >
                                { errors.map((err) => (
                                    <li key={err.message} > { err.message } </li>
                                ))}
                            </ul>
                        }

                        <button
                            className="btn-primary mb-1 icon-btn justify-center"
                            type="submit"
                            disabled={!stripe || !elements}
                        >
                            Buy now
                            <ThreeDots visible={loading} height={10} width={30} color="#E0F4FF" />
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}