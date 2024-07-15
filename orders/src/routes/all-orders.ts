import express, { Request, Response } from "express";
import { Order } from "../models/orders";
import { requireAuth } from "@ojctickets/common";

const router = express.Router();

router.get(
    "/api/orders",
    requireAuth,
    async (req: Request, res: Response) => {
        const userID = req.currentUser!.id;
        const orders = await Order.find({ userID }).populate("ticket");
        res.status(200).send(orders);
    }
);

export { router as allOrdersRouter };