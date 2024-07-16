import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Ticket } from "../../../models/tickets";
import { Message } from "node-nats-streaming";
import {
    natsWrapper,
    TicketCreatedEvent
} from "@ojctickets/common";

const setup = async() => {
    const listener = new TicketCreatedListener(natsWrapper.client);
    const data: TicketCreatedEvent["data"] = {
        version: 0,
        title: "testTicket",
        price: 30,
        id: new mongoose.Types.ObjectId().toHexString(),
        userID: new mongoose.Types.ObjectId().toHexString()
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return { listener, data, msg };
};

it("Successfully creates and saves a new ticket document", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});