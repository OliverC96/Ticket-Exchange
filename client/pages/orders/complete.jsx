import Router from "next/router";
import BillingDetails from "../../components/email-templates/BillingDetails";
import CostSummary from "../../components/email-templates/CostSummary";
import { parseDate } from "../../utils/parse_date";
import { IoReceiptOutline } from "react-icons/io5";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import { getCharges } from "../../utils/calculate_charges";

export default () => {

    async function handleSubmission(event) {
        event.preventDefault();
        await Router.push("/orders");
    }

    const { id, ticket, taxPercent, discount } = JSON.parse(localStorage.getItem("order"));
    const { name, email, address } = JSON.parse(localStorage.getItem("customer"));

    const d = parseDate();
    const charges = getCharges(ticket.price, taxPercent, discount, false);

    return (
        <div className="page-wrapper">
            <div className="card p-8">
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
                            <CostSummary charges={charges} />
                            <div className="flex justify-between items-center">
                                <BillingDetails name={name} address={address} />
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