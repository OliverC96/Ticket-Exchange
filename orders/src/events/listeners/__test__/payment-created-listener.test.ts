import { PaymentCreatedListener } from "../payment-created-listener";
import { PaymentCreatedEvent } from "@ojctickets/common";
import { natsWrapper, OrderStatus } from "@ojctickets/common";
import { TicketDocument } from "../../../models/tickets";
import { OrderDocument } from "../../../models/orders";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/orders";

const setup = async() => {
    const listener = new PaymentCreatedListener(natsWrapper.client);
    const ticket: TicketDocument = await global.createTicket();
    const order: OrderDocument = await global.createOrder(ticket.id);

    const data: PaymentCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        orderID: order.id,
        chargeID: "stripeChargeID"
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg };
}

it("Successfully updates order status to 'complete'", async() => {
    const { listener, data, msg } = await setup();

    const originalOrder = await Order.findById(data.orderID);
    expect(originalOrder!.status).toEqual(OrderStatus.Created);
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(data.orderID);
    expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it("Successfully acknowledges the event message", async() => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});