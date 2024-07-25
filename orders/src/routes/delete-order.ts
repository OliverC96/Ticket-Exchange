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

const router = express.Router();

router.patch(
    "/api/orders/:id",
    requireAuth,
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier."),
    validateRequest,
    async (req: Request, res: Response) => {
        const userID = req.currentUser!.id;
        const orderID = req.params.id;

        const order = await Order.findById(orderID).populate("ticket");
        if (!order) {
            throw new NotFoundError();
        }
        if (order.userID !== userID) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.__v,
            ticket: {
                id: order.ticket.id
            }
        });

        res.status(200).send(order);
    }
);

export { router as deleteOrderRouter };