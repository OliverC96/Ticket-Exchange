import express, { Response, Request } from "express";
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus,
    natsWrapper
} from "@ojctickets/common";
import { Order } from "../models/orders";
import { body } from "express-validator";
import { stripe } from "../stripe";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

const router = express.Router();

router.post(
    "/api/payments",
    requireAuth,
    [
        body("tokenID")
            .notEmpty()
            .withMessage("Missing Stripe Token ID."),
        body("orderID")
            .isMongoId()
            .withMessage("Invalid MongoDB identifier")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { tokenID, orderID } = req.body;
        const userID = req.currentUser!.id;
        const order = await Order.findById(orderID);

        if (!order) {
            throw new NotFoundError();
        }
        if (order.userID !== userID) {
            throw new NotAuthorizedError();
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError(`Cannot create charge - order ${orderID} is cancelled.`);
        }
        if (order.status === OrderStatus.Refunded) {
            throw new BadRequestError(`Cannot create charge - order ${orderID} has been refunded.`);
        }

        order.status = OrderStatus.AwaitingPayment;

        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: "cad",
            description: `Order ID: ${order.id}`,
            metadata: {
                timePurchased: new Date().getTime()
            },
            source: tokenID
        });

        if (charge.status !== "succeeded") {
            await order.save();
            throw new BadRequestError(`Failed to charge user ${userID} for order ${order.id}.`)
        }

        const payment = Payment.build({
            orderID: order.id,
            chargeID: charge.id
        });
        await payment.save();

        order.status = OrderStatus.Complete;
        await order.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderID: order.id,
            chargeID: charge.id
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };