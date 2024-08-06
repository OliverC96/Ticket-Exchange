import mongoose from "mongoose";
import { DatabaseConnectionError } from "@ojctickets/common";
import { server } from "./server";
import { natsWrapper } from "@ojctickets/common";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const initialize = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY must be defined.");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("Mongo URI must be defined.");
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS Cluster ID must be defined.");
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS Client ID must be defined.");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS URL must be defined.");
    }

    // Establish a connection to MongoDB
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Successfully connected to MongoDB database");
    }
    catch (err) {
        console.log("Failed to connect to MongoDB database: ", err);
        throw new DatabaseConnectionError();
    }

    // Connect to the Nats Streaming Server (i.e., the event bus)
    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
    );

    // Terminate the NATS connection upon receiving a shutdown signal
    natsWrapper.client.on("close", () => {
        console.log("Terminated connection to NATS Streaming server");
        process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // Ensure the payments service receives events pertaining to order creation and order cancellation
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    server.listen(3001, () => {
        console.log("Successfully launched on port 3001.");
    });
}

initialize();