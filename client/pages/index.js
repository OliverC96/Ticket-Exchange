import Ticket from "../components/Ticket";
import SortButton from "../components/SortButton";
import { RiExchange2Fill } from "react-icons/ri";
import { CgSortAz } from "react-icons/cg";
import useSorting from "../hooks/use-sorting";
import FilterForm from "../components/FilterForm";
import { useState, useEffect } from "react";

// Landing page component which displays all currently available listings
export default function LandingPage({ currentUser, originalTickets }) {

    const DISCOUNTS = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5];
    const discountPercent = DISCOUNTS[Math.floor(Math.random() * DISCOUNTS.length)];

    const [tickets, setTickets] = useState(originalTickets);
    const [discount, setDiscount] = useState({
        originalPrice: 0,
        discountID: ""
    });

    // Randomly discount a ticket listing upon initial render
    useEffect(() => {
        if (tickets.length > 0) {
            const randIndex = Math.floor(Math.random() *  tickets.length);
            const t = tickets[randIndex];
            setTickets((prev) => [
                ...prev.slice(0, randIndex),
                {
                    ...prev[randIndex],
                    price: t.price * (1 - discountPercent)
                },
                ...prev.slice(randIndex + 1)
            ]);
            setDiscount({
                originalPrice: t.price,
                discountID: t.id
            });
        }
    }, []);

    const {
        title,
        price,
        updateSortingOptions,
        resetSortingOptions
    } = useSorting({ tickets, setTickets });

    return (
        <div className="w-screen -mt-[10vh] flex justify-center h-screen decal gap-4">
            {/* Logo image */}
            <RiExchange2Fill className="absolute top-20 left-20 text-blue-xlight" size={65} />
            {/* Ticket grid */}
            <div className="ticket-grid ml-20">
                {/* Sorting options */}
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
                {/* Ticket listings */}
                {tickets.length > 0
                    ?
                        tickets.map((ticket) => {
                            return <Ticket
                                key={ticket.id}
                                currUser={currentUser}
                                discount={discount}
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