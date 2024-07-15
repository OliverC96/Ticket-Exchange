import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";

it("StatusCode = 400 when provided invalid MongoDB identifier", async() => {
    const ticketID = "testID";
    return request(server)
        .get(`/api/tickets/${ticketID}`)
        .set("Cookie", global.getCookie())
        .expect(400);
});

it("StatusCode = 404 if the queried ticket does not exist", async() => {
    const ticketID = new mongoose.Types.ObjectId().toHexString();
    return request(server)
        .get(`/api/tickets/${ticketID}`)
        .expect(404);
});

it("Successfully retrieves the desired ticket if it exists", async() => {
    const ticket = await global.createTicket({});
    const response = await request(server)
        .get(`/api/tickets/${ticket.id}`)
        .expect(200);
    expect(response.body.title).toEqual(ticket.title);
    expect(response.body.price).toEqual(ticket.price);
});