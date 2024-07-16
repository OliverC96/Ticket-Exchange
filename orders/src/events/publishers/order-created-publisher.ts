import {
    Publisher,
    OrderCreatedEvent,
    Subjects
} from "@ojctickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}