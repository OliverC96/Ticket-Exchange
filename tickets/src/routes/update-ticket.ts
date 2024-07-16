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

const router = express.Router();

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
        const ticketID = req.params.id;
        const ticket = await Ticket.findById(ticketID);
        if (!ticket) {
            throw new NotFoundError();
        }
        if (ticket.orderID) {
            throw new BadRequestError("Cannot update a reserved ticket.");
        }
        if (userID !== ticket.userID) {
            throw new NotAuthorizedError();
        }

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

        return res.status(200).send(ticket);
    }
);

export { router as updateTicketRouter };