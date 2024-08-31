import Ticket from "../components/Ticket";
import SortButton from "../components/SortButton";
import { RiExchange2Fill } from "react-icons/ri";
import { CgSortAz } from "react-icons/cg";
import useSorting from "../hooks/use-sorting";
import FilterForm from "../components/FilterForm";
import { useState } from "react";

export default function LandingPage({ currentUser, originalTickets }) {
    const [tickets, setTickets] = useState(originalTickets);
    const {
        title,
        price,
        updateSortingOptions,
        resetSortingOptions
    } = useSorting({ tickets, setTickets, originalTickets });
    return (
        <div className="w-screen -mt-[10vh] flex justify-center h-screen decal gap-4">
            <RiExchange2Fill className="absolute top-20 left-20 text-blue-xlight" size={65} />
            <div className="ticket-grid ml-20">
                <div className="col-span-4 flex gap-4 items-center">
                    <div className="flex items-center mr-4">
                        <CgSortAz size={48}/>
                        <p className="text-xl"> Sort Results </p>
                    </div>
                    <SortButton
                        type="Price"
                        toggleDirection={() => updateSortingOptions("price")}
                        {...price}
                    />
                    <SortButton
                        type="Title"
                        toggleDirection={() => updateSortingOptions("title")}
                        {...title}
                    />
                </div>
                {tickets.length > 0
                    ?
                        tickets.map((ticket) => {
                            return <Ticket key={ticket.id} currUser={currentUser} {...ticket} />;
                        })
                    :
                        <p
                            className="col-span-4"
                        >
                            We couldn't find any listings matching the specified conditions. Try adjusting the current filters to receive more results.
                        </p>
                }
            </div>
            <FilterForm
                tickets={originalTickets}
                setTickets={setTickets}
                resetSortingOptions={resetSortingOptions}
            />
        </div>
    );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get("/api/tickets");
    return {
        originalTickets: data,
        currentUser
    };
};