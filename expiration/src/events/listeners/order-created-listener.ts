import {
    Listener,
    OrderCreatedEvent,
    Subjects
} from "@ojctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const expirationTime = new Date(data.expiresAt).getTime();
        const currentTime = new Date().getTime();

        await expirationQueue.add(
            {
                orderID: data.id
            },
            {
                delay: expirationTime - currentTime
            }
        );
        msg.ack();
    }
}