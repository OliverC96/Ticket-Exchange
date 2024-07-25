import Ticket from "../components/Ticket";

export default function LandingPage({ currentUser, tickets }) {
    return (
        <div className="flex h-screen w-screen bg-blue-dark justify-center">
            <div className="flex flex-col gap-3 text-lg text-blue-xlight pt-8">
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