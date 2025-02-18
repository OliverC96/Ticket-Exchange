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
        <div className="w-screen -mt-[10vh] flex justify-center min-h-screen pb-10 decal gap-4 text-blue-xlight">
            {/* Logo image */}
            <RiExchange2Fill className="absolute top-20 left-20 hidden lg:block" size={65} />
            <div className="flex gap-9 justify-center w-full mt-24 lg:mt-[8.5rem]">
                {/* Ticket grid */}
                <div className="flex flex-col gap-44 md:gap-6 h-fit w-1/3 md:w-1/2">
                    {/* Sorting options */}
                    <div className="sort-options">
                        <div className="flex items-center mr-4">
                            <CgSortAz size={48} className="-my-3 lg:-my-2" />
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
                    <div className="ticket-grid">
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
                </div>
                {/* Filter options */}
                <FilterForm
                    tickets={originalTickets}
                    setTickets={setTickets}
                    resetSortingOptions={resetSortingOptions}
                />
            </div>
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