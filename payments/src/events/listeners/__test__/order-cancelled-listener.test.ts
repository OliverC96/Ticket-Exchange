import {
    natsWrapper,
    OrderCancelledEvent,
    OrderStatus
} from "@ojctickets/common";
import { OrderCancelledListener } from "../order-cancelled-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";

const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userID: new mongoose.Types.ObjectId().toHexString(),
        price: 30,
        status: OrderStatus.Created
    });
    await order.save();

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString()
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, msg, data, order };
}

it("Successfully cancels the order", async() => {
    const { listener, msg, data, order } = await setup();
    expect(order.status).toEqual(OrderStatus.Created);

    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.version).toEqual(order.version + 1);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    expect(updatedOrder!.price).toEqual(order.price);
    expect(updatedOrder!.userID).toEqual(order.userID);
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});