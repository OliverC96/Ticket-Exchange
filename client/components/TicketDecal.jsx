import { LuTicket } from "react-icons/lu";
import { BsTicketPerforatedFill } from "react-icons/bs";
import { FaTicket } from "react-icons/fa6";

export default function TicketDecal() {
    return (
        <div className="text-blue-light flex flex-col gap-10 opacity-90 self-center">
            <LuTicket className="rotate-45 hover:rotate-[65deg] transition duration-300" size={120} />
            <BsTicketPerforatedFill className="-rotate-45 hover:-rotate-[60deg] transition duration-300" size={120} />
            <FaTicket className="rotate-45 hover:rotate-[65deg] transition duration-300" size={120} />
        </div>
    );
};