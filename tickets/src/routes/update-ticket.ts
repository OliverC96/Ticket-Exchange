import express, { Request, Response } from "express"
import { body, param } from "express-validator";
import { Ticket } from "../models/tickets";
import {
    NotFoundError,
    NotAuthorizedError,
    requireAuth,
    validateRequest,
    natsWrapper,
    BadRequestError
} from "@ojctickets/common";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { posthogClient } from "../index";

const router = express.Router();

// An API route encapsulating ticket update logic
router.put(
    "/api/tickets/:id",
    requireAuth,
    [
        body("title")
            .notEmpty()
            .withMessage("Title must be specified."),
        body("price")
            .isFloat({ gt: 0 })
            .withMessage("Price must be greater than 0.")
    ],
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier."),
    validateRequest,
    async (req: Request, res: Response) => {
        const userID = req.currentUser!.id;
        const userEmail = req.currentUser!.email;
        const ticketID = req.params.id;
        const ticket = await Ticket.findById(ticketID); // Retrieve the ticket
        if (!ticket) {
            throw new NotFoundError(); // Ticket does not exist
        }
        if (ticket.orderID) {
            throw new BadRequestError("Cannot update a reserved ticket."); // Ticket is currently reserved (i.e., tied to an order)
        }
        if ((userID !== ticket.userID) && (userEmail !== process.env.ADMIN_EMAIL)) {
            throw new NotAuthorizedError(); // Cannot update another user's ticket
        }

        // Perform the update operation
        ticket.set({
            ...req.body
        });

        await ticket.save();
        await new TicketUpdatedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userID: ticket.userID
        });
        posthogClient!.capture({
            distinctId: userID,
            event: "ticket:updated",
            properties: {
                id: ticket.id,
                updated_price: ticket.price,
                updated_title: ticket.title,
                version: ticket.version,
                source: "tickets-srv"
            }
        });

        return res.status(200).send(ticket);
    }
);

export { router as updateTicketRouter };