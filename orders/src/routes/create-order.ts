import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
    requireAuth,
    validateRequest,
    NotFoundError,
    OrderStatus,
    BadRequestError,
    DatabaseConnectionError,
    natsWrapper
} from "@ojctickets/common";
import { Ticket } from "../models/tickets";
import { Order } from "../models/orders";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import mongoose from "mongoose";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

// An API route encapsulating order creation logic
router.post(
    "/api/orders",
    requireAuth,
    body("ticketID")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier"),
    validateRequest,
    async (req: Request, res: Response) => {
        const userID = req.currentUser!.id;
        const { ticketID } = req.body; // Extract the ID of the ticket associated with the order

        // Retrieve the corresponding ticket document
        const ticket = await Ticket.findById(ticketID);
        if (!ticket) {
            throw new NotFoundError(); // Ticket does not exist (i.e., invalid ticket ID)
        }

        const isReserved = await ticket.isReserved();

        // Block the order creation attempt - another user is already in the process of purchasing the ticket
        // Note: the ticket will become available again if it is not purchased by the other user within the 15-minute expiration window
        if (isReserved) {
            throw new BadRequestError("Ticket is already reserved by another user.");
        }

        // Initialize the expiration window (to effectively reserve the ticket for 15 minutes)
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

        // Construct the new order document
        const newOrder = Order.build({
            userID,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket
        });

        const session = await mongoose.startSession();

        try {
            // Executing all order creation logic within a single transaction
            session.startTransaction();
            await newOrder.save();
            await new OrderCreatedPublisher(natsWrapper.client).publish({
                id: newOrder.id,
                version: newOrder.version,
                status: newOrder.status,
                userID: newOrder.userID,
                expiresAt: newOrder.expiresAt.toISOString(),
                ticket: {
                    id: ticket.id,
                    price: ticket.price
                }
            });
            await session.commitTransaction();
            res.status(201).send(newOrder);
        }
        catch (err) {
            await session.abortTransaction();
            throw new DatabaseConnectionError();
        }
        finally {
            await session.endSession();
        }

    }
);

export { router as createOrderRouter };