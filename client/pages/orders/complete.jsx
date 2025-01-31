import Router from "next/router";
import BillingDetails from "../../components/email-templates/BillingDetails";
import CostSummary from "../../components/email-templates/CostSummary";
import { IoReceiptOutline } from "react-icons/io5";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import ChargeManager from "../../utils/ChargeManager";
import { usePostHog } from "posthog-js/react";

// Displays an order confirmation summary
export default () => {

    const posthog = usePostHog();

    // Extract the relevant information from local storage
    const { id, ticket, discount, timestamp: d } = JSON.parse(localStorage.getItem("order"));
    const { name, email, address } = JSON.parse(localStorage.getItem("customer"));

    async function handleSubmission(event) {
        event.preventDefault();
        posthog?.capture("order_complete", {
            id,
            discount,
            ticketID: ticket.id
        });
        await Router.push("/orders");
    }

    const chargeManager = new ChargeManager(
        ticket.price,
        discount,
        address.state,
        false,
        false
    );

    return (
        <div className="page-wrapper">
            <div className="card p-8 w-3/4 md:w-auto">
                <form className="flex flex-col gap-5" onSubmit={handleSubmission}>

                    <div className="order-confirm-header">
                        <h1 className="font-bold">
                            Order #{id} - <span className="text-green-400"> COMPLETE </span>
                        </h1>
                        <p className="text-lg opacity-80"> {d.day} {d.date} {d.month} {d.year} @ {d.hours}:{d.minutes} {d.tag} </p>
                    </div>

                    <div className="flex flex-col gap-5 mx-10">
                        <p className="text-lg"> Confirmation email sent to <span className="underline"> { email } </span> </p>

                        <div className="order-confirm-summary">
                            <CostSummary charges={chargeManager.getCharges()} forEmail={false} />
                            <div className="flex justify-between items-center">
                                <BillingDetails name={name} address={address} forEmail={false} />
                                <IoReceiptOutline size={58} />
                            </div>
                        </div>

                        <button className="btn-primary flex gap-1.5 justify-center items-center" type="submit">
                            <RiArrowRightDoubleFill className="text-xl" />
                            View Orders
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}