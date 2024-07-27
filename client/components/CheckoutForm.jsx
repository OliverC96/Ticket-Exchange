import useRequest from "../hooks/use-request";
import Router from "next/router";
import { useState, useEffect, useRef } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement
} from "@stripe/react-stripe-js";
import { elementStyle } from "../styles/stripe-form";
import { FaRegCreditCard } from "react-icons/fa";

export default function CheckoutForm({ order, currentUser }) {

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [tokenID, setTokenID] = useState("");
    const isFirstRender = useRef(true);

    const { performRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            tokenID,
            orderID: order.id
        },
        onSuccess: () => Router.push("/orders")
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

        const card = elements.getElement(CardNumberElement);
        const res = await stripe.createToken(card);

        if (res.token) {
            setTokenID(res.token.id);
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

    const isFR = useRef(true);
    useEffect(() => {
        if (isFR.current) {
            isFR.current = false;
            return;
        }
        elements.getElement(CardNumberElement).update(elementStyle);
        elements.getElement(CardExpiryElement).update(elementStyle);
        elements.getElement(CardCvcElement).update(elementStyle);
    }, [elements]);

    return (
        <div className="bg-blue-dark h-screen -mt-[10vh] flex flex-col pt-20 items-center text-blue-xlight">
            <div className="bg-blue-xxdark flex flex-col p-8 rounded-lg outline outline-1 outline-blue-light w-fit">
                <div className="mb-2 self-center">
                    {
                        timeRemaining > 0
                            ? <h3 className="text-blue-xlight text-lg"> Time Remaining: { timeRemaining }s </h3>
                            : <h3 className="text-red-400 text-lg"> Order Expired </h3>
                    }
                </div>
                <form className="flex flex-col gap-5" onSubmit={handleSubmission}>

                    <h1 className="text-2xl font-bold">
                        Purchase <i>{ order.ticket.title  }</i> - ${ order.ticket.price  } CAD
                    </h1>

                    <div className="form-field" >
                        <label id="email">
                            Email Address
                        </label>
                        <input
                            className="form-input"
                            name="email"
                            value={currentUser.email}
                            disabled
                        />
                    </div>

                    <div className="w-full my-1 bg-blue-light h-0.5 rounded-lg opacity-50" />

                    <div className="form-field" id="cardNumber">
                        <label className="flex justify-between items-center">
                            Card Number
                            <FaRegCreditCard />
                        </label>
                        <CardNumberElement className="form-input" />
                    </div>

                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2 w-[48%]" id="expiryDate">
                            <label>
                                Expiry Date
                            </label>
                            <CardExpiryElement className="form-input" />
                        </div>
                        <div className="flex flex-col gap-2 w-[48%]" id="securityCode">
                            <label>
                                Security Code
                            </label>
                            <CardCvcElement className="form-input" />
                        </div>
                    </div>

                    { errors }

                    <button
                        className="btn-primary mt-2"
                        type="submit"
                        disabled={!stripe || !elements}
                    >
                        Buy now
                    </button>

                </form>
            </div>
        </div>
    );
}