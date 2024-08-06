import {
    Listener,
    Subjects,
    OrderCancelledEvent,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

/**
 * Listens for events pertaining to order cancellation
 * @extends Listener
 */
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = QueueGroupNames.TicketService;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const ticketID = data.ticket.id;
        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            throw new Error(`Failed to update ticket ${ticketID}`); // Cannot update non-existent ticket
        }

        // Unset the orderID attribute (effectively cancel the order from the perspective of the tickets service)
        ticket.set({
            orderID: undefined
        });
        await ticket.save();

        // Inform other services of the newly-cancelled ticket
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            orderID: ticket.orderID,
            userID: ticket.userID,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version,
        });

        msg.ack();
    }
}