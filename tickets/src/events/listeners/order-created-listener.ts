import {
    Listener,
    Subjects,
    OrderCreatedEvent
} from "@ojctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const ticketID = data.ticket.id;
        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            throw new Error("Ticket not found.");
        }

        ticket.set({
            orderID: data.id
        });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            ...ticket
        });

        msg.ack();
    }
}