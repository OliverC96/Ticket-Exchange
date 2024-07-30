import Router from "next/router";

export default function Ticket({ id, title, price, currUser }) {
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
            <h1 className="text-lg"> { title } </h1>
            <h3 className="text-xl flex gap-1 items-center"> ${ price } <span className="text-xs opacity-85">CAD</span> </h3>
        </div>
    );
}