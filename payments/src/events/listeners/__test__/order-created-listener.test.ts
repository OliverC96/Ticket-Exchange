import {
    natsWrapper,
    OrderCreatedEvent,
    OrderStatus
} from "@ojctickets/common";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";

const setup = async() => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: "expiryTime",
        userID: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString(),
            price: 50
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, msg, data };
}

it("Successfully replicates relevant order information", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);

    expect(order!.version).toEqual(data.version);
    expect(order!.status).toEqual(data.status);
    expect(order!.price).toEqual(data.ticket.price);
    expect(order!.userID).toEqual(data.userID);
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});