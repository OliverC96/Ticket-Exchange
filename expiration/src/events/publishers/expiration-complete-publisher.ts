import {
    Publisher,
    ExpirationCompleteEvent,
    Subjects
} from "@ojctickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}