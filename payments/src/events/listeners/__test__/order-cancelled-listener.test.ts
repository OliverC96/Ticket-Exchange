import {
    natsWrapper,
    OrderCancelledEvent,
    OrderStatus
} from "@ojctickets/common";
import { OrderCancelledListener } from "../order-cancelled-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";
import { Payment } from "../../../models/payments";
import { stripe } from "../../../stripe";
import { server } from "../../../server";
import request from "supertest";

const setup = async() => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const userID = new mongoose.Types.ObjectId().toHexString();
    const order = await global.createOrder(userID);

    const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: new mongoose.Types.ObjectId().toHexString()
        },
        refunded: false
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

it("Successfully refunds the order", async() => {

    const { listener, msg, data, order } = await setup();

    const tokenID = "tok_visa";
    const response = await request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie(order.userID))
        .send({ tokenID, orderID: order.id })
        .expect(201);

    data.refunded = true;
    data.version += 1; // Additional update on orders document due to payment creation
    expect(order.status).toEqual(OrderStatus.Created);

    await listener.onMessage(data, msg);
    const payment = await Payment.findById(response.body.id);
    expect(payment).not.toBeNull(); // Ensure the original payment record remains in the payments database

    const stripeCharge = await stripe.charges.retrieve(payment!.chargeID);
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge.refunded).toBeTruthy();

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.version).toEqual(order.version + 2);
    expect(updatedOrder!.status).toEqual(OrderStatus.Refunded);
    expect(updatedOrder!.price).toEqual(order.price);
    expect(updatedOrder!.userID).toEqual(order.userID);
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});