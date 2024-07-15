import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { errorHandler, NotFoundError, currentUser } from "@ojctickets/common";
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
    secure: process.env.NODE_ENV !== "test"
}));
server.use(currentUser);

server.use(createTicketRouter);
server.use(updateTicketRouter);
server.use(deleteTicketRouter);
server.use(oneTicketRouter);
server.use(allTicketsRouter);

server.all("*", async (req, res) => {
    throw new NotFoundError();
});

server.use(errorHandler);

export { server };