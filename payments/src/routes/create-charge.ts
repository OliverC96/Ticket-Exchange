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
        body("token")
            .notEmpty()
            .withMessage("Missing pre-authorization token."),
        body("orderID")
            .isMongoId()
            .withMessage("Invalid MongoDB identifier")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { token, orderID } = req.body;
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

        const charge = await stripe.charges.create({
            currency: "cad",
            amount: order.price * 100,
            source: token
        });
        const payment = Payment.build({
            orderID: order.id,
            chargeID: charge.id
        });
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            ...payment
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };