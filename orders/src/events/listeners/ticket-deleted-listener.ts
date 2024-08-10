import {
    TicketDeletedEvent,
    Subjects,
    Listener,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";

export class TicketDeletedListener extends Listener<TicketDeletedEvent> {
    readonly subject = Subjects.TicketDeleted;
    queueGroupName = QueueGroupNames.OrderService;

    async onMessage(data: TicketDeletedEvent["data"], msg: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error(`Failed to delete ticket ${data.id}`);
        }
        await Ticket.findByIdAndDelete(ticket.id);
        msg.ack();
    }
}