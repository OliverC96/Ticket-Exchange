import Ticket from "../components/Ticket";
import SortButton from "../components/SortButton";
import { RiExchange2Fill } from "react-icons/ri";
import { CgSortAz } from "react-icons/cg";
import useSorting from "../hooks/use-sorting";
import FilterForm from "../components/FilterForm";
import { useState} from "react";

// Landing page component which displays all currently available listings
export default function LandingPage({ currentUser, originalTickets }) {

    const [tickets, setTickets] = useState(originalTickets);

    const {
        title,
        price,
        updateSortingOptions,
        resetSortingOptions
    } = useSorting({ tickets, setTickets });

    return (
        <div className="w-screen -mt-[10vh] flex justify-center min-h-screen pb-10 decal gap-4">
            {/* Logo image */}
            <RiExchange2Fill className="absolute top-20 left-20 text-blue-xlight hidden lg:block" size={65} />
            {/* Ticket grid */}
            <div className="ticket-grid">
                {/* Sorting options */}
                <div className="col-span-full flex flex-col pb-7 lg:pb-0 lg:flex-row gap-4 items-start lg:items-center w-full lg:w-auto">
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
                {/* Ticket listings */}
                {tickets.length > 0
                    ?
                        tickets.map((ticket) => {
                            return <Ticket
                                key={ticket.id}
                                currUser={currentUser}
                                {...ticket}
                            />;
                        })
                    :
                        <p
                            className="col-span-4"
                        >
                            We couldn't find any listings matching the specified conditions. Try adjusting the current filters to receive more results.
                        </p>
                }
            </div>
            {/* Filter options */}
            <FilterForm
                tickets={originalTickets}
                setTickets={setTickets}
                resetSortingOptions={resetSortingOptions}
            />
        </div>
    );
};

// Fetch all tickets on initial page load, and during subsequent client-side navigations
LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get("/api/tickets");
    return {
        originalTickets: data,
        currentUser
    };
};