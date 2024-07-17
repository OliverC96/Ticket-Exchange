import {
    natsWrapper,
    Subjects,
    OrderStatus,
    ExpirationCompleteEvent
} from "@ojctickets/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/orders";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async() => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);
    const ticket = await global.createTicket();

    const order = Order.build({
        userID: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    const data: ExpirationCompleteEvent["data"] = {
        orderID: order.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, msg, order };
};

it("Successfully cancels an order document", async() => {
    const { listener, data, msg, order } = await setup();
    expect(order.status).toEqual(OrderStatus.Created);
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("Successfully publishes an 'order:cancelled' event", async() => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(Subjects.OrderCancelled, expect.anything(), expect.anything());

    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(eventData.id).toEqual(order.id);
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});