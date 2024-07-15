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
        const ticket = await Ticket.findById(ticketID);
        if (!ticket) {
            throw new NotFoundError();
        }
        if (userID !== ticket.userID) {
            throw new NotAuthorizedError();
        }
        const deletedTicket = await Ticket.findByIdAndDelete(ticketID);
        return res.status(204).send(deletedTicket);
    }
);

export { router as deleteTicketRouter };