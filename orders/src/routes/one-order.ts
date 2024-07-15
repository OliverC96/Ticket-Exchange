import express, { Request, Response } from "express";
import { param } from "express-validator";
import { Order } from "../models/orders";
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest
} from "@ojctickets/common";

const router = express.Router();

router.get(
    "/api/orders/:id",
    requireAuth,
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier."),
    validateRequest,
    async (req: Request, res: Response) => {
        const orderID = req.params.id;
        const userID = req.currentUser!.id;

        const order = await Order.findById(orderID).populate("ticket");
        if (!order) {
            throw new NotFoundError();
        }
        if (order.userID !== userID) {
            throw new NotAuthorizedError();
        }

        return res.status(200).send(order);
    }
);

export { router as oneOrderRouter };