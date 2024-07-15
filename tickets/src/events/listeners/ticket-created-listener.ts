import { Listener, TicketCreatedEvent, Subjects } from "@ojctickets/common";
import { Message } from "node-nats-streaming";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {

    readonly subject = Subjects.TicketCreated;
    queueGroupName = "payments-service";

    onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        console.log(`Received event from ${this.subject}`);
        console.log(data);
        msg.ack();
    };

}