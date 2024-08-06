import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";
import {BadRequestError, NotFoundError, validateRequest} from "@ojctickets/common";
import { param } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

// An API route responsible for retrieving a single ticket document
router.get(
    "/api/tickets/:id",
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier"),
    validateRequest,
    async (req: Request, res: Response) => {
        const ticketID = req.params.id; // Extract the ID of the desired ticket
        const match = await Ticket.findById(ticketID); // Attempt to retrieve the ticket
        if (!match) {
            throw new NotFoundError(); // Ticket does not exist in the database
        }
        return res.status(200).send(match);
    }
);

export { router as oneTicketRouter }