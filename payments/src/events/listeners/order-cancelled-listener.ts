import {
    BadRequestError,
    Listener,
    OrderCancelledEvent,
    OrderStatus,
    QueueGroupNames,
    Subjects
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = QueueGroupNames.PaymentService;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {

        const order = await Order.findByEvent(data);
        if (!order) {
            throw new Error(`Order ${data.id} not found.`);
        }

        if (!data.refunded) {
            order.status = OrderStatus.Cancelled;
            await order.save();
            return msg.ack();
        }

        const payment = await Payment.findOne({ orderID: order.id });
        if (!payment) {
            throw new Error(`Failed to retrieve payment associated with order ${order.id}.`);
        }

        const refund = await stripe.refunds.create({
            charge: payment.chargeID
        });

        if (refund.status === "failed") {
            throw new BadRequestError(`Failed to process refund for order ${order.id}`);
        }

        order.status = OrderStatus.Refunded;
        await order.save();

        msg.ack();
    }
}