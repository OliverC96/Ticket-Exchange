import {
    Listener,
    Subjects,
    OrderCancelledEvent
} from "@ojctickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
        const ticketID = data.ticket.id;
        const ticket = await Ticket.findById(ticketID);

        if (!ticket) {
            throw new Error("Ticket not found.");
        }

        ticket.set({
            orderID: undefined
        });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticketID,
            ...ticket
        });

        msg.ack();
    }
}