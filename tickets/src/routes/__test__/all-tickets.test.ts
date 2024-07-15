import request from "supertest";
import { server } from "../../server";
import { TicketType } from "../../models/tickets";

it("Successfully retrieves the collection of tickets", async() => {
    const NUM_TICKETS = 5;
    for (let i = 1; i <= NUM_TICKETS; i++) {
        const currTicket: TicketType = {
            title: "ticket" + i.toString(),
            price: i
        };
        await global.createTicket({ newTicket: currTicket });
    }
    const response = await request(server)
        .get("/api/tickets")
        .expect(200);
    expect(response.body.length).toEqual(NUM_TICKETS);

    for (let i = 0; i < NUM_TICKETS; i++) {
        const currTicket = response.body[i];
        expect(currTicket.title).toEqual("ticket" + (i + 1).toString());
        expect(currTicket.price).toEqual(i + 1);
    }
});