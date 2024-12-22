import mongoose from "mongoose";
import { DatabaseConnectionError, posthogClient } from "@ojctickets/common";
import { server } from "./server";

const initialize = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined.");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo URI must be defined.");
    }
    if (!posthogClient) {
        throw new Error("Failed to connect to PostHog analytics.");
    }
    try {
        // Establish a connection to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to MongoDB database.");
    }
    catch (err) {
        console.log("Failed to connect to MongoDB database: ", err);
        throw new DatabaseConnectionError();
    }
    server.listen(3001, () => {
        console.log("Successfully launched on port 3001");
    });
    await posthogClient.shutdown();
}

initialize();