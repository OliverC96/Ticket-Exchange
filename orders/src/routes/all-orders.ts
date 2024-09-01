import express, { Request, Response } from "express";
import { Order } from "../models/orders";
import { requireAuth } from "@ojctickets/common";

const router = express.Router();

// An API route responsible for retrieving all orders associated with a particular user
router.get(
    "/api/orders",
    requireAuth,
    async (req: Request, res: Response) => {
        const userID = req.currentUser!.id;
        // Retrieve the current user's order history
        const orders = await Order.find({ userID }).populate("ticket");
        res.status(200).send(orders);
    }
);

export { router as allOrdersRouter };