import {
    TicketCreatedEvent,
    Subjects,
    Listener,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

/**
 * Listens for events pertaining to ticket creation
 * @extends Listener
 */
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = QueueGroupNames.OrderService;

    async onMessage(data: TicketCreatedEvent["data"], msg: Message): Promise<void> {
        const { id, title, price } = data;
        // Create a copy of the new ticket document, and save it locally
        const ticket = Ticket.build({
            id,
            title,
            price
        });
        await ticket.save();
        msg.ack();
    }
}