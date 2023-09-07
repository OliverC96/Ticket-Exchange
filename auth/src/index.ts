import express from "express";
import mongoose from "mongoose"
import cookieSession from "cookie-session";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { loginRouter } from "./routes/login";
import { logoutRouter } from "./routes/logout";
import { registerRouter } from "./routes/register";
import { errorHandler } from "./middlewares/error-handler";
import { InvalidRouteError } from "./errors/InvalidRouteError";
import { DatabaseConnectionError } from "./errors/DatabaseConnectionError";

const server = express();

server.set('trust proxy', true);
server.use(json());
server.use(cookieSession({
    signed: false,
    secure: true
}));

server.use(currentUserRouter);
server.use(loginRouter);
server.use(logoutRouter);
server.use(registerRouter);

server.all("*", async (req, res) => {
    throw new InvalidRouteError();
});

server.use(errorHandler);

const initializeDatabase = async () => {
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("Successfully connected to MongoDB database")
    }
    catch (err) {
        console.log("Failed to connect to MongoDB database: ", err);
        throw new DatabaseConnectionError();
    }
}

initializeDatabase();

server.listen(3001, () => {
    console.log("Auth server successfully launched on port 3001.");
});
