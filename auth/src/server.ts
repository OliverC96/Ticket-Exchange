import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { errorHandler } from "./middlewares/error-handler";
import { InvalidRouteError } from "./errors/InvalidRouteError";

const server = express();

server.set('trust proxy', true);    // Trust traffic originating from the ingress nginx proxy
server.use(json());
server.use(cookieSession({
    signed: false,  // Disable encryption (JWT is already encrypted, by default)
    secure: process.env.NODE_ENV !== "test"
}));

server.use(currentUserRouter);
server.use(loginRouter);
server.use(logoutRouter);
server.use(registerRouter);

server.all("*", async (req, res) => {
    throw new InvalidRouteError();
});

server.use(errorHandler);

export { server };