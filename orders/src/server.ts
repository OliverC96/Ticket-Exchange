import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import {
    errorHandler,
    NotFoundError,
    currentUser
} from "@ojctickets/common";

import { allOrdersRouter } from "./routes/all-orders";
import { oneOrderRouter } from "./routes/one-order";
import { createOrderRouter } from "./routes/create-order";
import { deleteOrderRouter } from "./routes/delete-order";

const server = express();

server.set('trust proxy', true);    // Trust traffic originating from the ingress nginx proxy
server.use(json());
server.use(cookieSession({
    signed: false,  // Disable encryption (JWT is already encrypted, by default)
    secure: false
}));
server.use(currentUser);

server.use(allOrdersRouter);
server.use(oneOrderRouter);
server.use(createOrderRouter);
server.use(deleteOrderRouter);

server.all("*", async (req, res) => {
    throw new NotFoundError();
});

server.use(errorHandler);

export { server };