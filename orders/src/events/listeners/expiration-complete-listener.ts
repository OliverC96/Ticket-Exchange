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

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = QueueGroupNames.OrderService;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderID).populate("ticket");

        if (!order) {
            throw new Error(`Order cancellation failed - order (id: ${data.orderID}) does not exist.`)
        }
        if (order.status === OrderStatus.Complete || order.status === OrderStatus.Refunded) {
            return msg.ack();
        }
        order.status = OrderStatus.Cancelled
        await order.save();

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