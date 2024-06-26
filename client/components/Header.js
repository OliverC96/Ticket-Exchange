import Link from "next/link"

export default function Header() {
    return (
        <div className="flex flex-row justify-between">
            <div id="title">
                <h1> Ticket Exchange </h1>
            </div>
            <div id="links">
                <Link href=""> Login </Link>
                <Link href=""> Register </Link>
            </div>
        </div>
    );
}