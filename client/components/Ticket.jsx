import Link from "next/link";
import { RiArrowRightDoubleFill } from "react-icons/ri";

export default function Ticket({ id, title, price, currUser }) {
    return (
        <div className="flex gap-1 items-center group" >
            <RiArrowRightDoubleFill
                className="opacity-0 group-hover:opacity-100 text-blue-xlight transition duration-200 text-2xl"
            />
            <Link
                href={currUser ? `/tickets/${id}` : "/auth/register"}
                className="w-fit">
                { title } - ${ price }
            </Link>
        </div>
    );
}