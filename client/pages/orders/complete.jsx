import Router from "next/router";
import BillingDetails from "../../components/email-templates/BillingDetails";
import CostSummary from "../../components/email-templates/CostSummary";
import { parseDate } from "../../utils/parse_date";
import { IoReceiptOutline } from "react-icons/io5";
import { RiArrowRightDoubleFill } from "react-icons/ri";
import {
    getTaxAmount,
    getTotal
} from "../../utils/calculate_charges";

export default () => {

    async function handleSubmission(event) {
        event.preventDefault();
        await Router.push("/orders");
    }

    const { id, ticket, taxPercent, discount } = JSON.parse(localStorage.getItem("order"));
    const { name, email, address } = JSON.parse(localStorage.getItem("customer"));

    const d = parseDate();
    const taxAmount = getTaxAmount(ticket.price, taxPercent);
    const total = getTotal(ticket.price, taxAmount, discount).toFixed(2);

    const charges = [
        {
            type: "Ticket Price",
            amount: ticket.price.toFixed(2)
        },
        {
            type: `Tax (${taxPercent}%)`,
            amount: taxAmount.toFixed(2)
        },
        {
            type: "Discount",
            amount: discount.toFixed(2)
        }
    ];

    return (
        <div className="bg-blue-dark h-screen -mt-[10vh] flex flex-col justify-center items-center text-blue-xlight">
            <div className="bg-blue-xxdark flex flex-col p-8 rounded-lg outline outline-1 outline-blue-light">
                <form className="flex flex-col gap-5" onSubmit={handleSubmission}>

                    <div className="flex flex-col gap-2 items-center text-2xl text-center">
                        <h1 className="font-bold">
                            Order #{id} - <span className="text-green-400"> COMPLETE </span>
                        </h1>
                        <p className="text-lg opacity-80"> {d.day} {d.date} {d.month} {d.year} @ {d.hours}:{d.minutes} {d.tag} </p>
                    </div>

                    <div className="flex flex-col gap-5 mx-10">
                        <p className="text-lg"> Confirmation email sent to <span className="underline"> { email } </span> </p>

                        <div className="flex flex-col gap-6 py-6 px-8 bg-blue-dark rounded-md ring-1 ring-blue-light">
                            <CostSummary charges={charges} total={total} />
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