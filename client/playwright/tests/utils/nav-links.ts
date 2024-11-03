type Link = {
    label: string,
    href: string,
    requiresAuth: boolean
};

const navLinks: Link[] = [
    {
        label: "Create",
        href: "/tickets/create",
        requiresAuth: true
    },
    {
        label: "Orders",
        href: "/orders",
        requiresAuth: true
    },
    {
        label: "Logout",
        href: "/auth/logout",
        requiresAuth: true
    },
    {
        label: "Register",
        href: "/auth/register",
        requiresAuth: false
    },
    {
        label: "Login",
        href: "/auth/login",
        requiresAuth: false
    },
    {
        label: "Ticket-Exchange",
        href: "/",
        requiresAuth: true
    },
    {
        label: "Ticket-Exchange",
        href: "/",
        requiresAuth: false
    }
];

export { navLinks };