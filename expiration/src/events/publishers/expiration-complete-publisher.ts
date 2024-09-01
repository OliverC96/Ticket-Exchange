import {
    Publisher,
    ExpirationCompleteEvent,
    Subjects
} from "@ojctickets/common";

/**
 * Informs other services of an order's expiration
 * @extends Publisher
 */
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}