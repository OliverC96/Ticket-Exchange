import { Listener, TicketUpdatedEvent, Subjects } from "@ojctickets/common";
import { Message } from "node-nats-streaming";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {

    readonly subject = Subjects.TicketUpdated;
    queueGroupName = "payments-service";

    onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        console.log(`Received event from ${this.subject}`);
        console.log(data);
        msg.ack();
    };

}