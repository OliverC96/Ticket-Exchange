import {
    Publisher,
    Subjects,
    PaymentCreatedEvent
} from "@ojctickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}