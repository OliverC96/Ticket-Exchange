import OrderConfirmed from "../../components/email-templates/OrderConfirmed";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

export default async function (req, res) {

    const props = JSON.parse(req.body);

    const { data, error } = await resend.emails.send({
        from: "clennanoliver@gmail.com",
        to: "clennanoliver@gmail.com",
        subject: `Order #${props.orderID} - CONFIRMED`,
        react: OrderConfirmed(props)
    });

    if (error) {
        res.status(400).json(error);
    }
    res.status(200).json(data);
}