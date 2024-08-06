import express, { Request, Response } from "express";
import {
    NotFoundError,
    NotAuthorizedError,
    requireAuth,
    validateRequest
} from "@ojctickets/common";
import { param } from "express-validator";
import { Ticket } from "../models/tickets";

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
        return res.status(204).send(deletedTicket);
    }
);

export { router as deleteTicketRouter };