import express, { Request, Response } from "express";
import {
    NotFoundError,
    NotAuthorizedError,
    requireAuth,
    validateRequest,
    natsWrapper
} from "@ojctickets/common";
import { param } from "express-validator";
import { Ticket } from "../models/tickets";
import { TicketDeletedPublisher } from "../events/publishers/ticket-deleted-publisher";

const router = express.Router();

// An API route encapsulating ticket deletion logic
router.delete(
    "/api/tickets/:id",
    requireAuth,
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier."),
    validateRequest,
    async (req: Request, res: Response) => {
        const ticketID = req.params.id;
        const userID = req.currentUser!.id;
        const ticket = await Ticket.findById(ticketID); // Retrieving the desired ticket document
        if (!ticket) {
            throw new NotFoundError(); // Cannot delete a ticket which does not exist
        }
        if (userID !== ticket.userID) {
            throw new NotAuthorizedError(); // Cannot delete another user's ticket
        }

        const deletedTicket = await Ticket.findByIdAndDelete(ticketID); // Deleting the ticket
        await new TicketDeletedPublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version
        });

        return res.status(204).send(deletedTicket);
    }
);

export { router as deleteTicketRouter };