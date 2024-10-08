import {
    TicketUpdatedEvent,
    Subjects,
    Listener,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

/**
 * Listens for events pertaining to ticket modification
 * @extends Listener
 */
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = QueueGroupNames.OrderService;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error(`Failed to update ticket ${data.id}`); // Cannot update non-existent ticket
        }

        // Update the ticket document accordingly
        const { title, price } = data;
        ticket.set({
            title,
            price
        });
        await ticket.save();

        msg.ack();
    }
}