import { Ticket } from "../tickets";
import mongoose from "mongoose";

it("Implements Optimistic Concurrency Control", async() => {
    const ticket = Ticket.build({
        title: "testTicket",
        price: 30,
        userID: "userID"
    });
    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({
        price: 20
    });
    secondInstance!.set({
        price: 40
    });

    await firstInstance!.save();

    try {
        await secondInstance!.save();
    }
    catch (err) {
        expect(err).toBeInstanceOf(mongoose.Error.VersionError);
    }
});

it("Properly increments the version number on concurrent updates", async() => {
    const ticket = Ticket.build({
        title: "testTicket",
        price: 30,
        userID: "userID"
    });
    for (let i = 0; i < 10; i++) {
        await ticket.save();
        expect(ticket.version).toEqual(i);
    }
});