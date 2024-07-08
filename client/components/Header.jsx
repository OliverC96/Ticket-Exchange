import Link from "next/link";

export default function Header({ currentUser }) {

    // Conditionally rendered links based on the current user's authentication status
    const links = [
        !currentUser && {label: "Register", href: "/auth/register"},
        !currentUser && {label: "Login", href: "/auth/login"},
         currentUser && {label: "Logout", href: "/auth/logout"}
    ]
        .filter(Boolean)
        .map(({ label, href }) => {
            return (
                <Link
                    className="hover:underline"
                    key={href}
                    href={href}
                >
                    { label }
                </Link>
            )
        });

    return (
        <div className="bg-blue-dark text-blue-xlight p-4 text-lg flex justify-between">
            <Link href="/">
                Ticket-Exchange
            </Link>
            <div className="flex gap-5">
                { links }
            </div>
        </div>
    );

}