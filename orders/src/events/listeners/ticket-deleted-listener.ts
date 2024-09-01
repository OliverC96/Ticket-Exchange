import {
    TicketDeletedEvent,
    Subjects,
    Listener,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

/**
 * Listens for events pertaining to ticket deletion
 * @extends Listener
 */
export class TicketDeletedListener extends Listener<TicketDeletedEvent> {
    readonly subject = Subjects.TicketDeleted;
    queueGroupName = QueueGroupNames.OrderService;

    async onMessage(data: TicketDeletedEvent["data"], msg: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error(`Failed to delete ticket ${data.id}`); // Cannot delete non-existent ticket
        }
        await Ticket.findByIdAndDelete(ticket.id); // Delete the ticket from the local database
        msg.ack();
    }
}