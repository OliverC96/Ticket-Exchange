import { OrderCancelledListener } from "../order-cancelled-listener";
import {
    natsWrapper,
    OrderCancelledEvent, Subjects
} from "@ojctickets/common";
import { Ticket } from "../../../models/tickets";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderID = new mongoose.Types.ObjectId().toHexString()
    const ticket = Ticket.build({
        title: "testTicket",
        price: 30,
        userID: new mongoose.Types.ObjectId().toHexString()
    });
    ticket.set({ orderID });
    await ticket.save();

    const data: OrderCancelledEvent["data"] = {
        id: orderID,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, msg, data, ticket, orderID };
}

it("Unsets the orderID attribute on the ticket document (i.e., frees up the ticket)", async() => {
    const { listener, ticket, data, msg, orderID } = await setup();
    expect(ticket.orderID).toBeDefined();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderID).toBeUndefined();
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it("Successfully publishes a 'ticket:updated' event", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(Subjects.TicketUpdated, expect.anything(), expect.anything());
});