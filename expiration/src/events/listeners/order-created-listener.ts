import {
    Listener,
    OrderCreatedEvent,
    Subjects,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

/**
 * Listens for events pertaining to order creation
 * @extends Listener
 */
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupNames.ExpirationService;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const expirationTime = new Date(data.expiresAt).getTime();
        const currentTime = new Date().getTime();

        await expirationQueue.add(
            {
                orderID: data.id
            },
            {
                delay: expirationTime - currentTime // Delay processing of the job until the expiration window has fully elapsed
            }
        );
        expirationQueue.client.bgsave(); // Asynchronously save the current state of the Redis dataset (i.e., create a point-in-time snapshot)

        msg.ack();
    }
}