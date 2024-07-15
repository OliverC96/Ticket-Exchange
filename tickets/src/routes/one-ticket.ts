import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";
import {BadRequestError, NotFoundError, validateRequest} from "@ojctickets/common";
import { param } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get(
    "/api/tickets/:id",
    param("id")
        .isMongoId()
        .withMessage("Invalid MongoDB identifier"),
    validateRequest,
    async (req: Request, res: Response) => {
        const ticketID = req.params.id;
        const match = await Ticket.findById(ticketID);
        if (!match) {
            throw new NotFoundError();
        }
        return res.status(200).send(match);
    }
);

export { router as oneTicketRouter }