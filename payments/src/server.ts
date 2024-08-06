import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import {
    errorHandler,
    NotFoundError,
    currentUser
} from "@ojctickets/common";
import { createChargeRouter } from "./routes/create-charge";

const server = express();

server.set('trust proxy', true);    // Trust traffic originating from the ingress nginx proxy
server.use(json());
server.use(cookieSession({
    signed: false,  // Disable encryption (JWT is already encrypted, by default)
    secure: false
}));
server.use(currentUser);

// Attach all routers related to the payments service
server.use(createChargeRouter);

// Configure a wildcard catch-all route for invalid URLs (i.e., those not prefixed with /api/payments)
server.all("*", async (req, res) => {
    throw new NotFoundError();
});

server.use(errorHandler);

export { server };