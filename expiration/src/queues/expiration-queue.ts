import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "@ojctickets/common";

interface Payload {
    orderID: string;
}

const expirationQueue = new Queue<Payload>(
    "order:expiration",
    {
        redis: {
            host: process.env.REDIS_HOST
        }
    }
);

// Redis persistence configuration (RDB snapshots are enabled by default)
expirationQueue.client.config("SET", "appendonly", "yes");  // Enable append-only log (AOF)
expirationQueue.client.config("SET", "appendfsync", "everysec"); // fsync with disk every second

expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderID: job.data.orderID
    });
    expirationQueue.client.bgsave(); // Asynchronously save the current state of the Redis dataset
});

export { expirationQueue };