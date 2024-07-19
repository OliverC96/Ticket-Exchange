import {
    Listener,
    OrderCancelledEvent,
    OrderStatus,
    Subjects
} from "@ojctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const order = await Order.findByEvent(data);
        if (!order) {
            throw new Error(`Order ${data.id} not found.`);
        }

        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();

        msg.ack();
    }
}