import mongoose from "mongoose"
import { DatabaseConnectionError } from "@ojctickets/common";
import { server } from "./server";

const initialize = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined.");
    }
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
        console.log("Successfully connected to MongoDB database");
    }
    catch (err) {
        console.log("Failed to connect to MongoDB database: ", err);
        throw new DatabaseConnectionError();
    }
    server.listen(3001, () => {
        console.log("Auth server successfully launched on port 3001.");
    });
}

initialize();