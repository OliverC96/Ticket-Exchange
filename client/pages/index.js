import { testTickets } from "../data/testTickets";
import Ticket from "../components/Ticket";

export default function LandingPage({ currentUser }) {
    return (
        <div className="flex flex-col p-8 gap-3 text-lg text-blue-dark w-fit" >
            { testTickets.map((ticket) => {
                const { id, ...rest } = ticket;
                return <Ticket key={id} {...rest} />;
            })}
        </div>
    );
}

LandingPage.getInitialProps = async (context, client, currentUser) => {
    return {};
}