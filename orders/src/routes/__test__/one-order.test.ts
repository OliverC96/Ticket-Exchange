import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";
import { OrderStatus } from "@ojctickets/common";

it("Can only be accessed by authenticated users", async() => {
    const orderID = new mongoose.Types.ObjectId().toHexString();
    // Ensuring non-authenticated users CANNOT view orders on the platform
    await request(server)
        .get(`/api/orders/${orderID}`)
        .expect(401);
    // Ensuring authenticated users CAN view orders on the platform
    const response = await request(server)
        .get(`/api/orders/${orderID}`)
        .set("Cookie", global.getCookie())
    expect(response.status).not.toEqual(401);
});

it("StatusCode = 400 when provided invalid MongoDB identifier", async() => {
    const orderID = "testID";
    return request(server)
        .get(`/api/orders/${orderID}`)
        .set("Cookie", global.getCookie())
        .expect(400);
});

it("StatusCode = 404 if the queried order does not exist", async () => {
    const orderID = new mongoose.Types.ObjectId().toHexString();
    return request(server)
        .get(`/api/orders/${orderID}`)
        .set("Cookie", global.getCookie())
        .expect(404);
});

it("StatusCode = 401 if the current user does not own the order", async () => {
    const userOne = global.getCookie();
    const userTwo = global.getCookie();
    const ticket = await global.createTicket();
    const order = await global.createOrder(ticket.id, userOne);

    return request(server)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", userTwo)
        .expect(401);
});

it("Successfully retrieves the desired order if it exists", async () => {
    const user = global.getCookie();
    const ticket = await global.createTicket();
    const order = await global.createOrder(ticket.id, user);

    const response = await request(server)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .expect(200);

    expect(response.body.id).toEqual(order.id);
    expect(response.body.ticket.id).toEqual(ticket.id);
    expect(response.body.status).toEqual(OrderStatus.Created);
});