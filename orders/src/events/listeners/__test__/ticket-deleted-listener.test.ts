import { TicketDeletedListener } from "../ticket-deleted-listener";
import { natsWrapper, TicketDeletedEvent } from "@ojctickets/common";
import { Ticket } from "../../../models/tickets";
import { Message } from "node-nats-streaming";

const setup = async() => {
    const listener = new TicketDeletedListener(natsWrapper.client);
    const originalTicket = await global.createTicket();

    const data: TicketDeletedEvent["data"] = {
        id: originalTicket.id,
        version: originalTicket.version + 1
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg };
};

it("Successfully deletes an existing ticket document", async() => {
    const { listener, data, msg } = await setup();

    const originalTicket = await Ticket.findById(data.id);
    expect(originalTicket).not.toBeNull();

    await listener.onMessage(data, msg);

    const deletedTicket = await Ticket.findById(data.id);
    expect(deletedTicket).toBeNull();
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});