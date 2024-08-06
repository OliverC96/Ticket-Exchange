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

// An API route responsible for bringing an order to completion (i.e., obtaining payment for the order)
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
        const order = await Order.findById(orderID); // Retrieve the matching order document

        if (!order) {
            throw new NotFoundError(); // Order does not exist
        }
        if (order.userID !== userID) {
            throw new NotAuthorizedError(); // Cannot charge one user for another user's order
        }
        if (order.status === OrderStatus.Cancelled) {
            throw new BadRequestError(`Cannot create charge - order ${orderID} is cancelled.`); // Order is cancelled
        }
        if (order.status === OrderStatus.Refunded) {
            throw new BadRequestError(`Cannot create charge - order ${orderID} has been refunded.`); // Order has been refunded
        }

        order.status = OrderStatus.AwaitingPayment; // Payment is pending

        // Create a charge (representative of the order document) through the Stripe API
        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: "cad",
            description: `Order ID: ${order.id}`,
            metadata: {
                timePurchased: new Date().getTime()
            },
            source: tokenID
        });

        if (charge.status !== "succeeded") { // Failed to create charge
            await order.save();
            throw new BadRequestError(`Failed to charge user ${userID} for order ${order.id}.`)
        }

        // Construct a payment document reflecting the newly-completed order
        const payment = Payment.build({
            orderID: order.id,
            chargeID: charge.id
        });
        await payment.save();

        // Update the order's status to "completed"
        order.status = OrderStatus.Complete;
        await order.save();

        // Inform other services of the newly-completed order
        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderID: order.id,
            chargeID: charge.id
        });

        res.status(201).send({ id: payment.id });
    }
);

export { router as createChargeRouter };