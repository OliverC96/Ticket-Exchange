import Ticket from "../components/Ticket";
import { RiExchange2Fill } from "react-icons/ri";

export default function LandingPage({ currentUser, tickets }) {
    return (
        <div className="w-screen -mt-[10vh] flex justify-center h-screen decal">
            <RiExchange2Fill className="absolute top-20 left-20 text-blue-xlight" size={65} />
            <div className="ticket-grid">
                { tickets.map((ticket) => {
                    return <Ticket key={ticket.id} currUser={currentUser} {...ticket} />;
                })}
            </div>
        </div>
    );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get("/api/tickets");
    return {
        tickets: data,
        currentUser
    };
};