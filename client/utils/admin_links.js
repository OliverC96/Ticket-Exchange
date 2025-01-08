import {
    FaGithub,
    FaDigitalOcean
} from "react-icons/fa";
import {
    SiPosthog,
    SiResend
} from "react-icons/si";

const adminLinks = [
    {
        name: "GitHub",
        url: "https://github.com/OliverC96/Ticket-Exchange",
        Icon: FaGithub
    },
    {
        name: "DigitalOcean",
        url: "https://cloud.digitalocean.com/projects/c44e3566-4eca-43fe-8a47-1186ce8b808c/resources?i=ed12df",
        Icon: FaDigitalOcean
    },
    {
        name: "PostHog",
        url: "https://us.posthog.com/project/101668",
        Icon: SiPosthog
    },
    {
        name: "Resend",
        url: "https://resend.com/emails",
        Icon: SiResend
    }
];

export { adminLinks };