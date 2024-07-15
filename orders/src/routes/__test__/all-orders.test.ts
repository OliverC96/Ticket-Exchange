import request from "supertest";
import { server } from "../../server";
import { OrderStatus } from "@ojctickets/common";

it("Can only be accessed by authenticated users", async() => {
    // Ensuring non-authenticated users CANNOT view orders on the platform
    await request(server)
        .get("/api/orders")
        .expect(401);
    // Ensuring authenticated users CAN view orders on the platform
    const response = await request(server)
        .get("/api/orders")
        .set("Cookie", global.getCookie())
    expect(response.status).not.toEqual(401);
});

it("Successfully retrieves all active orders for a particular user", async() => {
    const ticketOne = await global.createTicket();
    const ticketTwo= await global.createTicket();
    const ticketThree = await global.createTicket();

    const userOne = global.getCookie();
    const userTwo = global.getCookie();

    const orderOne = await global.createOrder(ticketOne.id, userOne);
    const orderTwo = await global.createOrder(ticketTwo.id, userTwo);
    const orderThree = await global.createOrder(ticketThree.id, userTwo);

    const response = await request(server)
        .get("/api/orders")
        .set("Cookie", userTwo)
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderTwo.id);
    expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body[1].id).toEqual(orderThree.id);
    expect(response.body[1].ticket.id).toEqual(ticketThree.id);

    for (let order of [orderOne, orderTwo, orderThree]) {
        expect(order.status).toEqual(OrderStatus.Created);
    }
});