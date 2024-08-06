import {
    Listener,
    OrderCreatedEvent,
    Subjects,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";

/**
 * Listens for events pertaining to order creation
 * @extends Listener
 */
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupNames.PaymentService;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({ // Create a copy of the order document
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            version: data.version,
            userID: data.userID
        });
        await order.save();

        msg.ack();
    }
}