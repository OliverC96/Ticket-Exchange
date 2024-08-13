import Router from "next/router";
import useRequest from "../hooks/use-request";
import { useRef } from "react";

export default function Ticket({ id, title, price, currUser }) {

    const containerRef = useRef(null);

    const { performRequest, errors } = useRequest({
        url: `/api/tickets/${id}`,
        method: "delete",
        body: {},
        onSuccess: () => window.location.reload()
    });

    const onClick = async() => {
        if (currUser) {
            await Router.push(`/tickets/${id}`);
        }
        else {
            await Router.push("/auth/register")
        }
    };

    const onKeyDown = async ({ keyCode }) => {
        if (keyCode === 46 || keyCode === 8) {
            await performRequest();
        }
    };

    return (
        <div
            ref={containerRef}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onMouseEnter={() => containerRef.current.focus()}
            onMouseLeave={() => containerRef.current.blur()}
            className="card gap-2 p-5 h-fit hover:outline-2 hover:cursor-pointer"
            tabIndex={-1}
        >
            <h1 className="text-lg"> {title} </h1>
            <h3 className="text-xl flex gap-1 items-center"> ${ price } <span className="text-xs opacity-85">CAD</span> </h3>
            { errors }
        </div>
    );
}