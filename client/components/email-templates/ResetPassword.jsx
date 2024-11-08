import {
    Body,
    Html,
    Tailwind
} from "@react-email/components";
import Metadata from "./Metadata";

export default function ResetPassword({ email, name }) {
    return (
        <Html>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                blue: {
                                    xlight: "#E0F4FF",
                                    dark: "#003049",
                                    xxdark: "#001B29"
                                }
                            }
                        }
                    }
                }}
            >
                <Body className="p-6 bg-blue-dark text-blue-xlight">
                    <Metadata />
                    <div className="mt-8 bg-blue-xxdark px-7 py-4 rounded-md outline outline-1 outline-blue-xlight">
                        <p> Hello <span className="font-bold"> {name}, </span> </p>
                        <p className="mt-3">
                            We received a password reset request for your Ticket-Exchange account associated
                            with {email}. Click the link below to choose a new password.
                        </p>
                        <a
                            href={`https://www.ticket-exchange.ca/auth/reset?email=${email}`}
                            className="mt-3"
                        >
                            Reset Password
                        </a>
                        <p className="mt-4">
                            If you did not initiate this request, please disregard this email.
                        </p>
                    </div>
                </Body>
            </Tailwind>
        </Html>
    );
}