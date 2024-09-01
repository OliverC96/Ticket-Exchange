import {
    Publisher,
    OrderCreatedEvent,
    Subjects
} from "@ojctickets/common";

/**
 * Informs other services that a new order has been created
 * @extends Publisher
 */
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}