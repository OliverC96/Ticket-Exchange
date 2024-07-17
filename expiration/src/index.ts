import { natsWrapper } from "@ojctickets/common";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const initialize = async () => {
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS Cluster ID must be defined.");
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS Client ID must be defined.");
    }
    if (!process.env.NATS_URL) {
        throw new Error("NATS URL must be defined.");
    }

    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
        console.log("Terminated connection to NATS Streaming server");
        process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new OrderCreatedListener(natsWrapper.client).listen();
}

initialize();