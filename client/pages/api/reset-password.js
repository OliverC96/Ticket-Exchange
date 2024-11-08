import { Resend } from "resend";
import ResetPassword from "../../components/email-templates/ResetPassword";

const resend = new Resend(process.env.RESEND_KEY);

// Sends an email containing a password reset link to the given user
export default async function (req, res) {

    // Extract the user's email address and name
    const props = JSON.parse(req.body);
    const recipientEmail = props.customer.email;
    const recipientName = recipientEmail.split('@')[0];

    // Send the email via the Resend API
    const { data, error } = await resend.emails.send({
        from: process.env.SENDER_NAME + " <" + process.env.SENDER_EMAIL + ">",
        to: recipientEmail || process.env.RECIPIENT_EMAIL,
        subject: `Password Reset Requested`,
        react: ResetPassword({ email: recipientEmail, name: recipientName })
    });

    if (error) {
        res.status(400).json(error);
    }
    res.status(200).json(data);
}