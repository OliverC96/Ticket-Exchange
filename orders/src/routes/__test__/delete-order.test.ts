import request from "supertest";
import { server } from "../../server";
import {
    OrderStatus,
    Subjects,
    natsWrapper
} from "@ojctickets/common";
import mongoose from "mongoose";

it("Can only be accessed by authenticated users", async() => {
    const orderID = new mongoose.Types.ObjectId().toHexString();
    // Ensuring non-authenticated users CANNOT cancel existing orders on the platform
    await request(server)
        .patch(`/api/orders/${orderID}`)
        .expect(401);
    // Ensuring authenticated users CAN cancel existing orders on the platform
    const response = await request(server)
        .patch(`/api/orders/${orderID}`)
        .set("Cookie", global.getCookie())
    expect(response.status).not.toEqual(401);
});

it("StatusCode = 400 when provided invalid MongoDB identifier", async() => {
    const orderID = "testID";
    return request(server)
        .patch(`/api/orders/${orderID}`)
        .set("Cookie", global.getCookie())
        .expect(400);
});

it("StatusCode = 404 if the queried order does not exist", async () => {
    const orderID = new mongoose.Types.ObjectId().toHexString();
    return request(server)
        .patch(`/api/orders/${orderID}`)
        .set("Cookie", global.getCookie())
        .expect(404);
});

it("StatusCode = 401 if the current user does not own the order", async () => {
    const userOne = global.getCookie();
    const userTwo = global.getCookie();
    const ticket = await global.createTicket();
    const order = await global.createOrder(ticket.id, userOne);

    return request(server)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", userTwo)
        .expect(401);
});

it("Successfully cancels the desired order if it exists", async () => {
    const user = global.getCookie();
    const ticket = await global.createTicket();
    const order = await global.createOrder(ticket.id, user);

    expect(order.status).toEqual(OrderStatus.Created);

    const response = await request(server)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .expect(200);

    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(ticket.id);
    expect(response.body.status).toEqual(OrderStatus.Refunded);
});

it("Successfully publishes an 'order:cancelled' event", async() => {
    const user = global.getCookie();
    const ticket = await global.createTicket();
    const order = await global.createOrder(ticket.id, user);

    await request(server)
        .patch(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
    expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(Subjects.OrderCancelled, expect.anything(), expect.anything());
});