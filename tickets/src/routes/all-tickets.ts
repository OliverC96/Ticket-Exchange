import express, { Request, Response } from "express";
import { Ticket } from "../models/tickets";

const router = express.Router();

// An API route responsible for retrieving all tickets currently present in the database
router.get(
    "/api/tickets",
    async (req: Request, res: Response) => {
        const tickets = await Ticket.find({ orderID: undefined });
        return res.status(200).send(tickets);
    }
);

export { router as allTicketsRouter };
