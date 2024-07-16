import {
    Publisher,
    OrderCancelledEvent,
    Subjects
} from "@ojctickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}