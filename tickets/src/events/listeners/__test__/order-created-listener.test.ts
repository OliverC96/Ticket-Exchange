import { OrderCreatedListener } from "../order-created-listener";
import {
    natsWrapper,
    OrderCreatedEvent,
    OrderStatus,
    Subjects
} from "@ojctickets/common";
import { Ticket } from "../../../models/tickets";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async() => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        title: "testTicket",
        price: 30,
        userID: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userID: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: "expiryDate",
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, ticket, data, msg };
}

it("Sets the orderID attribute on the ticket document (i.e., reserves the ticket)", async() => {
    const { listener, ticket, data, msg } = await setup();
    expect(ticket.orderID).toBeUndefined();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderID).toEqual(data.id);
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

    const ticketUpdatedData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(data.id).toEqual(ticketUpdatedData.orderID);
});