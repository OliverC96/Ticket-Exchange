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

/**
 * Listens for events pertaining to order cancellation
 * @extends Listener
 */
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = QueueGroupNames.PaymentService;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {

        const order = await Order.findByEvent(data); // Retrieve the matching order document
        if (!order) {
            throw new Error(`Order ${data.id} not found.`);
        }

        if (!data.refunded) {
            order.status = OrderStatus.Cancelled; // Update the order's status to "cancelled"
            await order.save();
            return msg.ack();
        }

        const payment = await Payment.findOne({ orderID: order.id });
        if (!payment) {
            throw new Error(`Failed to retrieve payment associated with order ${order.id}.`);
        }

        // Create a refund for the full order amount via the Stripe API
        const refund = await stripe.refunds.create({
            charge: payment.chargeID
        });

        if (refund.status === "failed") {
            throw new BadRequestError(`Failed to process refund for order ${order.id}`); // Refund failed
        }

        order.status = OrderStatus.Refunded; // Update the order's status to "refunded"
        await order.save();

        msg.ack();
    }
}