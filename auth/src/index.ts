import mongoose from "mongoose";
import { PostHog } from "posthog-node";
import { DatabaseConnectionError } from "@ojctickets/common";
import { server } from "./server";

let posthogClient;

const initialize = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined.");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo URI must be defined.");
    }
    if (!process.env.POSTHOG_API_KEY) {
        throw new Error("PostHog API key must be defined.");
    }
    posthogClient = new PostHog(
        process.env.POSTHOG_KEY!,
        {
            host: "https://us.i.posthog.com",
            flushAt: 1 // Flush the event queue after every event
        }
    );
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

export { posthogClient };