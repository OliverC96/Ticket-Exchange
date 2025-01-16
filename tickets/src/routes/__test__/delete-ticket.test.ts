import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";
import { Ticket } from "../../models/tickets";
import { natsWrapper, Subjects } from "@ojctickets/common";

it("Can only be accessed by authenticated users", async() => {
    // Ensuring non-authenticated users CANNOT delete existing tickets on the platform
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    await request(server)
        .delete(`/api/tickets/${ticketID}`)
        .expect(401);
    // Ensuring authenticated users CAN delete existing tickets on the platform
    const response = await request(server)
        .delete(`/api/tickets/${ticketID}`)
        .set("Cookie", global.getCookie())
    expect(response.status).not.toEqual(401);
});

it("StatusCode = 400 when provided invalid MongoDB identifier", async() => {
    const ticketID = "testID";
    return request(server)
        .delete(`/api/tickets/${ticketID}`)
        .set("Cookie", global.getCookie())
        .expect(400);
});

it("StatusCode = 404 if the ticket does not exist", async() => {
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    return request(server)
        .delete(`/api/tickets/${ticketID}`)
        .set("Cookie", global.getCookie())
        .expect(404);
});

it("StatusCode = 401 if the user does not own the ticket", async() => {
    const userOne = global.getCookie();
    const userTwo = global.getCookie();
    const ticket = await global.createTicket({ cookie: userOne });
    return request(server)
        .delete(`/api/tickets/${ticket.id}`)
        .set("Cookie", userTwo)
        .expect(401);
});

it("StatusCode = 204 upon successful ticket deletion", async() => {
    const cookie = global.getCookie();
    const ticket = await global.createTicket({ cookie });
    return request(server)
        .delete(`/api/tickets/${ticket.id}`)
        .set("Cookie", cookie)
        .expect(204);
});

it("Successfully deletes ticket document from MongoDB", async() => {
    const cookie = global.getCookie();
    const response = await global.createTicket({ cookie });
    let ticket = await Ticket.findById(response.id);
    expect(ticket!).not.toBeNull();
    await request(server)
        .delete(`/api/tickets/${response.id}`)
        .set("Cookie", cookie)
        .expect(204);
    ticket = await Ticket.findById(response.id);
    expect(ticket!).toBeNull();
});

it("Successfully publishes a 'ticket:deleted' event", async() => {
    const cookie = global.getCookie();
    const ticket = await global.createTicket({ cookie });
    await request(server)
        .delete(`/api/tickets/${ticket.id}`)
        .set("Cookie", cookie)
        .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
    expect(natsWrapper.client.publish).toHaveBeenLastCalledWith(Subjects.TicketDeleted, expect.anything(), expect.anything());
});