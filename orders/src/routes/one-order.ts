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

// An API route responsible for retrieving a single order document
router.get(
    "/api/orders/:id",
    requireAuth,
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier."),
    validateRequest,
    async (req: Request, res: Response) => {
        const orderID = req.params.id; // Extract the ID of the desired order
        const userID = req.currentUser!.id;
        // Attempt to retrieve the order
        const order = await Order.findById(orderID).populate("ticket");
        if (!order) {
            throw new NotFoundError(); // The desired order does not exist in the database
        }
        if (order.userID !== userID) {
            throw new NotAuthorizedError(); // The desired order exists, but the current user is not authorized to view it
        }

        return res.status(200).send(order);
    }
);

export { router as oneOrderRouter };