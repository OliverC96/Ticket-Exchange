import { useRef } from "react";
import useRequest from "../hooks/use-request";
import useOutsideAlerter from "../hooks/use-outside-alerter";
import useFormInput from "../hooks/use-form-input/ticket";
import Router from "next/router";
import { IoIosCreate } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { usePostHog } from "posthog-js/react";

// Create/edit ticket form
export default function TicketForm({ isModal, ticket, setModalVisible }) {

    const posthog = usePostHog();

    const priceRef = useRef(null);
    const { input, handleChange, onBlur, handleSubmission } = useFormInput({
        priceRef,
        ticket,
        onSubmit: async () => await performRequest()
    });

    // POST /api/tickets (for ticket creation) or PUT /api/tickets (for ticket modification)
    const { performRequest, errors } = useRequest({
        url: isModal ? `/api/tickets/${ticket.id}` : "/api/tickets",
        method: isModal ? "put" : "post",
        body: {
            title: input.title,
            price: parseFloat(input.price.toString().slice(1))
        },
        onSuccess: async (t) => {
            if (isModal) {
                setModalVisible(false);
                posthog?.capture("ticket_updated", {
                    id: t.id,
                    updated_price: t.price,
                    updated_title: t.title
                });
                return Router.reload();
            }
            else {
                posthog?.capture("ticket_created", {
                    id: t.id,
                    price: t.price,
                    title: t.title
                });
                await Router.push("/");
            }
        }
    });

    let containerRef;
    if (isModal) {
        containerRef = useOutsideAlerter({
            handleEvent: () => setModalVisible(false)
        });
    }

    return (
        <div className={`${isModal ? "modal-wrapper" : "page-wrapper"}`}>
            <div className="card p-8 card-breakpoints -mt-28" ref={containerRef}>
                <form className="flex flex-col gap-5" onSubmit={handleSubmission} >

                    <div className={`flex gap-4 items-center text-2xl ${isModal && "justify-between"}`}>
                        <h1 className="font-bold">
                            { isModal ? "Edit" : "Create a new ticket"}
                            { isModal && <span><i> {ticket.title} </i></span> }
                        </h1>
                        {
                            isModal ?
                                <IoCloseCircleOutline
                                    size={32}
                                    className="hover:cursor-pointer"
                                    onClick={() => setModalVisible(false)}
                                />
                                    : <IoIosCreate size={30} className="mb-1" />
                        }
                    </div>

                    <div className="form-field" >
                        <label id="title"> Title </label>
                        <input
                            className="form-input"
                            name="title"
                            value={input.title}
                            onChange={handleChange}
                            placeholder="Soccer Match"
                        />
                    </div>

                    <div className="form-field" >
                        <label id="price"> Price (CAD) </label>
                        <input
                            className="form-input"
                            name="price"
                            value={input.price}
                            onChange={handleChange}
                            onBlur={onBlur}
                            placeholder="$30.00"
                            ref={priceRef}
                        />
                    </div>

                    {/* Displays any errors encountered during the ticket creation/update process */}
                    { errors &&
                        <ul className="card-error" >
                            { errors.map((err) => (
                                <li key={err.message} > { err.message } </li>
                            ))}
                        </ul>
                    }

                    <button className="btn-primary mt-2" >
                        { isModal ? "Save" : "Create" }
                    </button>

                </form>
            </div>
        </div>
    );
}