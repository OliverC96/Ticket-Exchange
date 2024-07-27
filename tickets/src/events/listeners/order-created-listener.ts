import {
    Listener,
    Subjects,
    OrderCreatedEvent,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupNames.TicketService;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticketID = data.ticket.id;
        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            throw new Error(`Failed to retrieve ticket ${ticketID}`);
        }

        ticket.set({
            orderID: data.id
        });
        await ticket.save();

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