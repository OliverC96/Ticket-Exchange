import request from "supertest";
import { server } from "../../server";
import mongoose from "mongoose";
import { OrderStatus } from "@ojctickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

it("StatusCode = 404 if the associated order does not exist", async() => {
    const token = "testToken";
    const orderID = new mongoose.Types.ObjectId().toHexString();
    return request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie())
        .send({ token, orderID })
        .expect(404);
});

it("StatusCode = 401 if the current user does not own the order", async() => {
    const userOne = new mongoose.Types.ObjectId().toHexString();
    const userTwo = new mongoose.Types.ObjectId().toHexString();
    const token = "testToken";
    const order = await global.createOrder(userOne);
    return request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie(userTwo))
        .send({ token, orderID: order.id })
        .expect(401);
});

it("StatusCode = 400 when attempting to purchase a cancelled order", async() => {
    const token = "testToken";
    const userID = new mongoose.Types.ObjectId().toHexString();
    const order = await global.createOrder(userID);

    order.set({
        status: OrderStatus.Cancelled
    });
    await order.save();

    return request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie(userID))
        .send({ token, orderID: order.id })
        .expect(400);
});

it("Successfully creates a charge", async() => {
    const token = "tok_visa";
    const userID = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = await global.createOrder(userID);

    order.set({ price });
    await order.save();

    const response = await request(server)
        .post("/api/payments")
        .set("Cookie", global.getCookie(userID))
        .send({ token, orderID: order.id })
        .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 10 });
    const stripeCharge = stripeCharges.data.find((charge) => {
        return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual("cad");
    expect(stripeCharge!.paid).toEqual(true);

    const payment = await Payment.findOne({
        orderID: order.id,
        chargeID: stripeCharge!.id
    });
    expect(payment).toBeDefined();
    expect(response.body.id).toEqual(payment!.id);
});