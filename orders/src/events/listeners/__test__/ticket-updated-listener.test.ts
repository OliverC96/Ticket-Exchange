import { TicketUpdatedListener } from "../ticket-updated-listener";
import {
    natsWrapper,
    TicketUpdatedEvent
} from "@ojctickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets";

const setup = async() => {
    const listener = new TicketUpdatedListener(natsWrapper.client);
    const originalTicket = await global.createTicket();

    const data: TicketUpdatedEvent["data"] = {
        version: originalTicket.version + 1,
        title: "testTicket",
        price: 30,
        id: originalTicket.id,
        userID: new mongoose.Types.ObjectId().toHexString()
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, originalTicket, data, msg };
};

it("Successfully updates an existing ticket document", async() => {
    const { listener, originalTicket, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(data.id);

    expect(updatedTicket).toBeDefined();
    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it("Does not acknowledge the event message in the case of out-of-order execution", async() => {
    const { listener, data, msg } = await setup();
    data.version = 10;
    await expect(listener.onMessage(data, msg)).rejects.toThrow();
    expect(msg.ack).not.toHaveBeenCalled();
});