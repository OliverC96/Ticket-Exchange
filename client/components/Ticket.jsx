import Link from "next/link";

export default function Ticket({ title, price, currUser }) {
    return (
        <Link
            href={currUser ? "/" : "/auth/register"}
            className="flex hover:underline">
            { title } - ${ price }
        </Link>
    );
}