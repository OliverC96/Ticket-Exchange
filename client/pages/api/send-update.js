import OrderRefunded from "../../components/email-templates/OrderRefunded";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_KEY);

export default async function (req, res) {

    const props = JSON.parse(req.body);

    const { data, error } = await resend.emails.send({
        from: "clennanoliver@gmail.com",
        to: "clennanoliver@gmail.com",
        subject: `Order #${props.orderID} - REFUNDED`,
        react: OrderRefunded(props)
    });

    if (error) {
        res.status(400).json(error);
    }
    res.status(200).json(data);
}