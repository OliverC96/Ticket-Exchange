import {
    Publisher,
    Subjects,
    PaymentCreatedEvent
} from "@ojctickets/common";

/**
 * Inform other services of successful payments
 * @extends Publisher
 */
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}