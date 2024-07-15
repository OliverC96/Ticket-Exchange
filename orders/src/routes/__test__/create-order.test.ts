import request from "supertest";
import { server } from "../../server";
import { Order } from "../../models/orders";
import mongoose from "mongoose";
import { OrderStatus } from "@ojctickets/common";
import { TicketDocument, TicketFields } from "../../models/tickets";

it("Can only be accessed by authenticated users", async() => {
    // Ensuring non-authenticated users CANNOT create new orders on the platform
    await request(server)
        .post("/api/orders")
        .send({})
        .expect(401);
    // Ensuring authenticated users CAN create new orders on the platform
    const authUser = await request(server)
        .post("/api/orders")
        .set("Cookie", global.getCookie())
        .send({});
    expect(authUser.status).not.toEqual(401);
});

it("StatusCode = 400 when provided invalid MongoDB identifier", async() => {
    const ticketID = "testID";
    return request(server)
        .post("/api/orders")
        .set("Cookie", global.getCookie())
        .send({ ticketID })
        .expect(400);
});

it("StatusCode = 404 if the ticket does not exist", async() => {
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    return request(server)
        .post("/api/orders")
        .set("Cookie", global.getCookie())
        .send({ ticketID })
        .expect(404);
});

it("StatusCode = 400 if the ticket is already reserved", async() => {
    const ticket: TicketDocument = await global.createTicket();
    await global.createOrder(ticket.id);
    return request(server)
        .post("/api/orders")
        .set("Cookie", global.getCookie())
        .send({ ticketID: ticket.id })
        .expect(400);
});

it("Successfully reserves a ticket (i.e., creates an order with the ticket)", async() => {
    const testTicket: TicketFields = {
        title: "ticketName",
        price: 30
    };
    const ticket: TicketDocument = await global.createTicket(testTicket);

    let orders = await Order.find({});
    expect(orders.length).toEqual(0);

    await global.createOrder(ticket.id);
    orders = await Order.find({}).populate("ticket");
    expect(orders.length).toEqual(1);

    const order = orders[0];
    expect(order.status).toEqual(OrderStatus.Created);
    expect(order.ticket.id).toEqual(ticket.id)
    expect(order.ticket.title).toEqual(testTicket.title);
    expect(order.ticket.price).toEqual(testTicket.price);
});

it.todo("Successfully publishes an 'order:created' event");