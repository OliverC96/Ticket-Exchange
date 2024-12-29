import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
    requireAuth,
    validateRequest,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus,
    natsWrapper
} from "@ojctickets/common";
import { Order } from "../models/orders";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { posthogClient } from "../index";

const router = express.Router();

// An API route encapsulating order deletion logic
router.patch(
    "/api/orders/:id",
    requireAuth,
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier."),
    validateRequest,
    async (req: Request, res: Response) => {
        const userID = req.currentUser!.id;
        const orderID = req.params.id; // Extract the ID of the order which is to be deleted

        // Attempt to retrieve the corresponding order document
        const order = await Order.findById(orderID).populate("ticket");
        if (!order) {
            throw new NotFoundError(); // The order does not exist
        }
        if (order.userID !== userID) {
            throw new NotAuthorizedError(); // The order exists, but the current user is not authorized to delete it (i.e., they do not have ownership over the order)
        }

        // Initiate a refund for the full order amount
        order.status = OrderStatus.Refunded;
        await order.save();

        posthogClient!.capture({
            distinctId: userID,
            event: "order:refunded",
            properties: {
                id: order.id,
                ticketID: order.ticket.id
            }
        });

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            },
            refunded: true
        });

        res.status(200).send(order);
    }
);

export { router as deleteOrderRouter };