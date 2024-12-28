import express, { Response, Request } from "express";
import {
    DatabaseConnectionError,
    requireAuth,
    validateRequest,
    natsWrapper
} from "@ojctickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { posthogClient } from "../index";
import mongoose from "mongoose";

const router = express.Router();

// An API route encapsulating ticket creation logic
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

        // Construct a new ticket document from the provided attributes
        const { title, price } = req.body;
        const newTicket = Ticket.build({
            title,
            price,
            userID: req.currentUser!.id
        });

        // Initializing a session
        const session = await mongoose.startSession();

        try {
            // Executing all ticket creation logic within a single transaction
            session.startTransaction();
            await newTicket.save();
            posthogClient!.capture({
                distinctId: newTicket.userID,
                event: "ticket:created",
                properties: {
                    id: newTicket.id,
                    version: newTicket.version,
                    title: newTicket.title,
                    price: newTicket.price,
                    source: "tickets-srv"
                }
            });
            await new TicketCreatedPublisher(natsWrapper.client).publish({
                id: newTicket.id,
                version: newTicket.version,
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