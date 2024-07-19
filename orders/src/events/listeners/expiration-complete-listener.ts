import {
    Listener,
    Subjects,
    ExpirationCompleteEvent,
    OrderStatus
} from "@ojctickets/common";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderID).populate("ticket");

        if (!order) {
            throw new Error(`Order cancellation failed - order (id: ${data.orderID}) does not exist.`)
        }
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        order.set({
            status: Subjects.OrderCancelled
        });

        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });

        msg.ack();
    }
}