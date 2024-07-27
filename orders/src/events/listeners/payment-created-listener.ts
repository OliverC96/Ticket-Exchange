import {
    Listener,
    Subjects,
    PaymentCreatedEvent,
    OrderStatus,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = QueueGroupNames.OrderService;

    async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
        const order = await Order.findById(data.orderID);
        if (!order) {
            throw new Error(`Order completion failed - order (id: ${data.orderID}) does not exist.`);
        }
        order.status = OrderStatus.Complete;
        await order.save();

        msg.ack();
    };
}