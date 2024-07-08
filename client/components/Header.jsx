import Link from "next/link";

export default function Header({ currentUser }) {

    const links = [
        {label: "Ticket-Exchange", href: "/"},
        !currentUser && {label: "Register", href: "/auth/register"},
        !currentUser && {label: "Login", href: "/auth/login"},
        currentUser && {label: "Logout", href: "/auth/logout"}
    ]
        .filter(Boolean)
        .map(({ label, href }) => {
            return (
                <Link
                    key={href}
                    href={href}
                >
                    { label }
                </Link>
            )
        });

    return (
        <div className="">
            {links}
        </div>
    );

}