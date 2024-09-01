import {
    Publisher,
    OrderCancelledEvent,
    Subjects
} from "@ojctickets/common";

/**
 * Informs other services that an order has been cancelled
 * @extends Publisher
 */
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}