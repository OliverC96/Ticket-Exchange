import OrderConfirmed from "../../components/email-templates/OrderConfirmed";
import { Resend } from "resend";
import { PostHog } from "posthog-js";

const resend = new Resend(process.env.RESEND_KEY);

// Sends an order confirmation email update to the current user
export default async function (req, res) {

    const props = JSON.parse(req.body);
    const recipientEmail = props.customer.email;

    // Send the email via the Resend API
    const { data, error } = await resend.emails.send({
        from: process.env.SENDER_NAME + " <" + process.env.SENDER_EMAIL + ">",
        to: recipientEmail || process.env.RECIPIENT_EMAIL,
        subject: "Order Confirmed!",
        react: OrderConfirmed(props)
    });

    if (error) {
        res.status(400).json(error);
    }
    res.status(200).json(data);
}