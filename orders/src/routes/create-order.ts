import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatus,
    BadRequestError
} from "@ojctickets/common";
import { Ticket } from "../models/tickets";
import { Order } from "../models/orders";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
    "/api/orders",
    requireAuth,
    body("ticketID")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier"),
    validateRequest,
    async (req: Request, res: Response) => {
        const userID = req.currentUser!.id;
        const { ticketID } = req.body;

        const ticket = await Ticket.findById(ticketID);
        if (!ticket) {
            throw new NotFoundError();
        }

        const isReserved = await ticket.isReserved();

        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved by another user.");
        }

        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        const newOrder = Order.build({
            userID,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });
        await newOrder.save();

        res.status(201).send(newOrder);
    }
);

export { router as createOrderRouter };