import {
    Listener,
    Subjects,
    PaymentCreatedEvent,
    OrderStatus
} from "@ojctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderID);
        if (!order) {
            throw new Error(`Order completion failed - order (id: ${data.orderID}) does not exist.`);
        }
        order.set({ status: OrderStatus.Complete });
        await order.save();

        msg.ack();
    };
}