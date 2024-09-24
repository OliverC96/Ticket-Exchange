import Router from "next/router";
import useRequest from "../hooks/use-request";
import { useRef, useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import TicketForm from "../components/TicketForm";
import ActionButton from "../components/ActionButton";

// Encapsulates a single ticket listing
export default function Ticket({ id, title, price, userID, currUser }) {

    const isOwner = userID === currUser?.id;
    const containerRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);

    // DELETE /api/tickets
    const { performRequest, errors } = useRequest({
        url: `/api/tickets/${id}`,
        method: "delete",
        body: {},
        onSuccess: () => Router.reload()
    });

    const onClick = async () => {
        if (currUser) { // If the current user is authenticated, proceed with purchase process
            await Router.push(`/tickets/${id}`);
        }
        else { // Redirect unauthenticated users to the registration page
            await Router.push("/auth/register")
        }
    };

    // Enable ticket deletion when user presses the 'backspace' or 'delete' key
    const onKeyDown = async ({ keyCode }) => {
        if (keyCode === 46 || keyCode === 8) {
            await performRequest();
        }
    };

    return (
        <div className="flex flex-col justify-center gap-1.5 relative">
            {/* Ticket update modal window */}
            {
                modalOpen &&
                    <TicketForm
                        isModal={true}
                        setModalVisible={setModalOpen}
                        ticket={{ id, title, price }}
                    />
            }
            {/* Displays all relevant ticket information */}
            <div
                ref={containerRef}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onMouseEnter={() => containerRef.current.focus()}
                onMouseLeave={() => containerRef.current.blur()}
                className="card gap-2 p-5 h-fit hover:outline-2 hover:cursor-pointer"
                tabIndex={-1}
            >
                <h1 className="text-lg"> { title } </h1>
                <h3 className="text-xl flex gap-1 items-center">
                    <p> ${ price } </p>
                    <span className="text-xs opacity-85">CAD</span>
                </h3>
                {/* Displays any errors encountered during the ticket deletion process */}
                { errors &&
                    <ul className="card-error" >
                        { errors.map((err) => (
                            <li key={err.message} > { err.message } </li>
                        ))}
                    </ul>
                }
            </div>
            {/* Restrict edit/delete privileges to the ticket owner */}
            {
                isOwner &&
                    <div className="flex gap-1.5">
                        <ActionButton Icon={IoMdCreate} onClick={() => setModalOpen(true)}/>
                        <ActionButton Icon={MdDelete} onClick={async () => await performRequest()}/>
                    </div>
            }
        </div>
    );
}