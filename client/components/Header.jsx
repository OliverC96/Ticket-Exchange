import Link from "next/link";

// Header (i.e., navbar) component containing top-level page links
export default function Header({ currentUser }) {

    // Conditionally rendered links based on the current user's authentication status
    const links = [
         currentUser && {label: "Create", href: "/tickets/create"},
         currentUser && {label: "Orders", href: "/orders"},
         currentUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && {label: "Dashboard", href: "/admin/dashboard"},
         currentUser && {label: "Logout", href: "/auth/logout"},
        !currentUser && {label: "Register", href: "/auth/register"},
        !currentUser && {label: "Login", href: "/auth/login"}
    ]
        .filter(Boolean)
        .map(({ label, href }) => {
            return (
                <Link
                    className="nav-link"
                    key={href}
                    href={href}
                >
                    { label }
                </Link>
            );
        });

    return (
        <div className="text-blue-xlight text-lg flex justify-between px-6 items-center h-[10vh] pt-0 mt-0">
            <Link href="/" className="font-title text-2xl">
                Ticket-Exchange
            </Link>
            <div className="flex gap-5">
                { links }
            </div>
        </div>
    );

}