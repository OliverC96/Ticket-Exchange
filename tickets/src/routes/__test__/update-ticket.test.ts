import request from "supertest";
import { server } from "../../server";
import { Ticket } from "../../models/tickets";
import { TicketType } from "../../models/tickets";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Subjects } from "@ojctickets/common";

it("Can only be accessed by authenticated users", async() => {
    // Ensuring non-authenticated users CANNOT update existing tickets on the platform
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    await request(server)
        .put(`/api/tickets/${ticketID}`)
        .send({})
        .expect(401);
    // Ensuring authenticated users CAN update existing tickets on the platform
    const response = await request(server)
        .put(`/api/tickets/${ticketID}`)
        .set("Cookie", global.getCookie())
        .send({});
    expect(response.status).not.toEqual(401);
});

it("StatusCode = 400 when provided invalid MongoDB identifier", async() => {
    const ticketID = "testID";
    return request(server)
        .put(`/api/tickets/${ticketID}`)
        .set("Cookie", global.getCookie())
        .expect(400);
});

it("StatusCode = 404 if the ticket does not exist", async() => {
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    const testTicket: TicketType = {
        title: "newTicket",
        price: 25
    };
    return request(server)
        .put(`/api/tickets/${ticketID}`)
        .set("Cookie", global.getCookie())
        .send(testTicket)
        .expect(404);
});

it("StatusCode = 401 if the user does not own the ticket", async() => {
    const userOne = global.getCookie();
    const userTwo = global.getCookie();
    const ticket = await global.createTicket({cookie: userOne});
    const updatedTicket: TicketType = {
        title: "updatedTicket",
        price: ticket.price + 100
    };
    return request(server)
        .put(`/api/tickets/${ticket.id}`)
        .set("Cookie", userTwo)
        .send(updatedTicket)
        .expect(401);
});

it("StatusCode = 400 when an invalid title is provided", async() => {
    const cookie = global.getCookie();
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    // Empty title provided
    await request(server)
        .put(`/api/tickets/${ticketID}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 80
        })
        .expect(400);
    // No title provided
    await request(server)
        .put(`/api/tickets/${ticketID}`)
        .set("Cookie", cookie)
        .send({
            price: 80
        })
        .expect(400);
});

it("StatusCode = 400 when an invalid price is provided", async() => {
    const cookie = global.getCookie();
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    // Negative price provided
    await request(server)
        .put(`/api/tickets/${ticketID}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: -1
        })
        .expect(400);
    // No price provided
    await request(server)
        .put(`/api/tickets/${ticketID}`)
        .set("Cookie", cookie)
        .send({
            title: "ticketName"
        })
        .expect(400);
});

it("Successfully updates existing ticket document", async() => {
    const cookie = global.getCookie();
    const originalTicket = await global.createTicket({ cookie });
    const updatedTicket: TicketType = {
        title: "updatedTicket",
        price: originalTicket.price + 100
    };
    const response = await request(server)
        .put(`/api/tickets/${originalTicket.id}`)
        .set("Cookie", cookie)
        .send(updatedTicket)
        .expect(200);

    const ticket = await Ticket.findById(originalTicket.id);
    expect(ticket!.title).toEqual(updatedTicket.title);
    expect(ticket!.price).toEqual(updatedTicket.price);
});

it("Successfully publishes a 'ticket:updated' event", async() => {
    const cookie = global.getCookie();
    const originalTicket = await global.createTicket({ cookie });
    const updatedTicket: TicketType = {
        title: "updatedTicket",
        price: originalTicket.price + 100
    };
    await request(server)
        .put(`/api/tickets/${originalTicket.id}`)
        .set("Cookie", cookie)
        .send(updatedTicket)
        .expect(200);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
    expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(Subjects.TicketUpdated, expect.anything(), expect.anything());
});