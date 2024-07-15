import express, { Request, Response } from "express";
import { param } from "express-validator";
import {
    requireAuth,
    validateRequest,
    NotAuthorizedError,
    NotFoundError,
    OrderStatus
} from "@ojctickets/common";
import { Order } from "../models/orders";

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

        res.status(200).send(order);
    }
);

export { router as deleteOrderRouter };