import Router from "next/router";
import {
    MdDelete,
    MdDeleteForever,
    MdOutlineDelete,
    MdOutlineDeleteForever
} from "react-icons/md";
import { LuDelete } from "react-icons/lu";
import useRequest from "../hooks/use-request";

export default function Ticket({ id, title, price, currUser }) {

    const { performRequest, errors } = useRequest({
        url: `/api/tickets/${id}`,
        method: "delete",
        body: {},
        onSuccess: () => Router.push("/")
    });

    const onClick = async() => {
        if (currUser) {
            await Router.push(`/tickets/${id}`);
        }
        else {
            await Router.push("/auth/register")
        }
    };

    return (
        <div
            onClick={onClick}
            className="card gap-2 p-5 h-fit hover:outline-2 hover:cursor-pointer" >
            <div>
                <h1 className="text-lg"> {title} </h1>
                <LuDelete onClick={async () => await performRequest()} />
            </div>
            <h3 className="text-xl flex gap-1 items-center"> ${ price } <span className="text-xs opacity-85">CAD</span> </h3>
            { errors }
        </div>
    );
}