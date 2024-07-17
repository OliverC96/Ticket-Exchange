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

expirationQueue.process(async (job) => {
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderID: job.data.orderID
    });
});

export { expirationQueue };