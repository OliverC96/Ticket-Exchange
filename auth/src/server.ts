import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@ojctickets/common";

import { currentUserRouter } from "./routes/current-user";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { resetPasswordRouter } from "./routes/reset";

const server = express();

server.set('trust proxy', true);    // Trust traffic originating from the ingress nginx proxy
server.use(json());
server.use(cookieSession({
    signed: false,  // Disable encryption (JWT is already encrypted, by default)
    secure: process.env.NODE_ENV !== 'test' // Enable cookies in unsecure tests environments (i.e., HTTP connections)
}));

// Attach all routers related to the auth service
server.use(currentUserRouter);
server.use(loginRouter);
server.use(logoutRouter);
server.use(registerRouter);
server.use(resetPasswordRouter);

// Configure a wildcard catch-all route for invalid URLs (i.e., those not prefixed with /api/users)
server.all("*", async (req, res) => {
    throw new NotFoundError();
});

server.use(errorHandler);

export { server };