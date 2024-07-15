import request from "supertest";
import { server } from "../../server";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";
import { Subjects } from "@ojctickets/common";

it("Can only be accessed by authenticated users", async() => {
    // Ensuring non-authenticated users CANNOT create new tickets on the platform
    await request(server)
        .post("/api/tickets")
        .send({})
        .expect(401);
    // Ensuring authenticated users CAN create new tickets on the platform
    const response = await request(server)
        .post("/api/tickets")
        .set("Cookie", global.getCookie())
        .send({});
    expect(response.status).not.toEqual(401);
});

it("StatusCode = 400 when an invalid title is provided", async() => {
    // Empty title provided
    await request(server)
        .post("/api/tickets")
        .set("Cookie", global.getCookie())
        .send({
            title: "",
            price: 80
        })
        .expect(400);
    // No title provided
    await request(server)
        .post("/api/tickets")
        .set("Cookie", global.getCookie())
        .send({
            price: 80
        })
        .expect(400);
});

it("StatusCode = 400 when an invalid price is provided", async() => {
    // Negative price provided
    await request(server)
        .post("/api/tickets")
        .set("Cookie", global.getCookie())
        .send({
            title: "",
            price: -1
        })
        .expect(400);
    // No price provided
    await request(server)
        .post("/api/tickets")
        .set("Cookie", global.getCookie())
        .send({
            title: "ticketName"
        })
        .expect(400);
});

it("StatusCode = 201 upon successful ticket creation", async() => {
    return global.createTicket({});
});

it("Successfully creates new ticket document", async() => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const ticket = await global.createTicket({});

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    expect(tickets[0].title).toEqual(ticket.title);
    expect(tickets[0].price).toEqual(ticket.price);
});

it("Successfully publishes a 'ticket:created' event", async() => {
    await global.createTicket({});
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(Subjects.TicketCreated, expect.anything(), expect.anything());
});