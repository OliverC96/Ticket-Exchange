import {
    Listener,
    Subjects,
    OrderCreatedEvent,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

/**
 * Listens for events pertaining to order creation
 * @extends Listener
 */
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupNames.TicketService;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticketID = data.ticket.id;
        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            throw new Error(`Failed to retrieve ticket ${ticketID}`); // Cannot update non-existent ticket
        }

        // Set the orderID attribute (i.e., reserve the ticket)
        ticket.set({
            orderID: data.id
        });
        await ticket.save();

        // Inform other services of the newly-reserved ticket
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userID: ticket.userID,
            orderID: ticket.orderID,
            version: ticket.version,
        });

        msg.ack();
    }
}