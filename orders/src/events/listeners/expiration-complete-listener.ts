import {
    Listener,
    Subjects,
    ExpirationCompleteEvent,
    OrderStatus,
    QueueGroupNames
} from "@ojctickets/common";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { posthogClient } from "../../index";

/**
 * Listens for events pertaining to order expiration
 * @extends Listener
 */
export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = QueueGroupNames.OrderService;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderID).populate("ticket");

        if (!order) {
            throw new Error(`Order cancellation failed - order (id: ${data.orderID}) does not exist.`) // Cannot cancel non-existent order
        }
        // Disregard the expiration event if the order has been successfully processed (or refunded)
        if (order.status === OrderStatus.Complete || order.status === OrderStatus.Refunded) {
            return msg.ack();
        }

        // Otherwise, proceed to cancel the order
        order.status = OrderStatus.Cancelled
        await order.save();

        posthogClient!.capture({
            distinctId: order.userID,
            event: "order:expired",
            properties: {
                id: order.id,
                source: "orders-srv"
            }
        });

        // Inform other services of the newly-cancelled order
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            },
            refunded: false
        });

        msg.ack();
    }
}