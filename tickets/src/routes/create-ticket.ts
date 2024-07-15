import express, { Response, Request } from "express";
import {
    DatabaseConnectionError,
    requireAuth,
    validateRequest
} from "@ojctickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";

const router = express.Router();

router.post(
    "/api/tickets",
    requireAuth,
    [
        body("title")
            .notEmpty()
            .withMessage("Title must be specified."),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0.")
    ],
    validateRequest,
    async (req: Request, res: Response) => {

        const { title, price } = req.body;
        const newTicket = Ticket.build({
            title,
            price,
            userID: req.currentUser!.id
        });

        const session = await mongoose.startSession();

        try {
            await session.startTransaction();
            await newTicket.save();
            await new TicketCreatedPublisher(natsWrapper.client).publish({
                id: newTicket.id,
                title: newTicket.title,
                price: newTicket.price,
                userID: newTicket.userID
            });
            await session.commitTransaction();
            res.status(201).send(newTicket);
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

export { router as createTicketRouter };