import {
    Listener,
    Subjects,
    OrderCancelledEvent,
    QueueGroupNames
} from "@ojctickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = QueueGroupNames.TicketService;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const ticketID = data.ticket.id;
        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            throw new Error(`Failed to update ticket ${ticketID}`);
        }

        ticket.set({
            orderID: undefined
        });
        await ticket.save();

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