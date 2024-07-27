import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";
import { OrderStatus } from "@ojctickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

it("StatusCode = 404 if the associated order does not exist", async() => {
    const tokenID = "testToken";
    const orderID = new mongoose.Types.ObjectId().toHexString();
    return request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie())
        .send({ tokenID, orderID })
        .expect(404);
});

it("StatusCode = 401 if the current user does not own the order", async() => {
    const userOne = new mongoose.Types.ObjectId().toHexString();
    const userTwo = new mongoose.Types.ObjectId().toHexString();
    const tokenID = "testToken";
    const order = await global.createOrder(userOne);
    return request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie(userTwo))
        .send({ tokenID, orderID: order.id })
        .expect(401);
});

it("StatusCode = 400 when attempting to purchase a cancelled order", async() => {
    const tokenID = "testToken";
    const userID = new mongoose.Types.ObjectId().toHexString();
    const order = await global.createOrder(userID);

    order.set({
        status: OrderStatus.Cancelled
    });
    await order.save();

    return request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie(userID))
        .send({ tokenID, orderID: order.id })
        .expect(400);
});

it("Successfully creates a charge", async() => {
    const tokenID = "tok_visa";
    const userID = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = await global.createOrder(userID);

    order.set({ price });
    await order.save();

    const response = await request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie(userID))
        .send({ tokenID, orderID: order.id })
        .expect(201);

    const payment = await Payment.findById(response.body.id);
    expect(payment).not.toBeNull();
    expect(response.body.id).toEqual(payment!.id);

    const stripeCharge = await stripe.charges.retrieve(payment!.chargeID);
    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual("cad");
    expect(stripeCharge!.paid).toEqual(true);

});