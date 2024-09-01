import OrderRefunded from "../../components/email-templates/OrderRefunded";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

// Sends an email update to the current user; informing them of a successful order refund
export default async function (req, res) {

    const props = JSON.parse(req.body);

    // Send the email via the Resend API
    const { data, error } = await resend.emails.send({
        from: process.env.SENDER_NAME + " <" + process.env.SENDER_EMAIL + ">",
        to: process.env.RECIPIENT_EMAIL,
        subject: `Order #${props.order.id} - REFUNDED`,
        react: OrderRefunded(props)
    });

    if (error) {
        res.status(400).json(error);
    }
    res.status(200).json(data);
}