import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import {
    errorHandler,
    NotFoundError,
    currentUser
} from "@ojctickets/common";
import { createTicketRouter } from "./routes/create-ticket";
import { updateTicketRouter } from "./routes/update-ticket";
import { deleteTicketRouter } from "./routes/delete-ticket";
import { oneTicketRouter } from "./routes/one-ticket";
import { allTicketsRouter } from "./routes/all-tickets";

const server = express();

server.set('trust proxy', true);    // Trust traffic originating from the ingress nginx proxy
server.use(json());
server.use(cookieSession({
    signed: false,  // Disable encryption (JWT is already encrypted, by default)
    secure: process.env.NODE_ENV !== 'test' // Enable cookies in unsecure tests environments (i.e., HTTP connections)
}));
server.use(currentUser);

// Attach all routers related to the tickets service
server.use(createTicketRouter);
server.use(updateTicketRouter);
server.use(deleteTicketRouter);
server.use(oneTicketRouter);
server.use(allTicketsRouter);

// Configure a wildcard catch-all route for invalid URLs (i.e., those not prefixed with /api/tickets)
server.all("*", async (req, res) => {
    throw new NotFoundError();
});

server.use(errorHandler);

export { server };