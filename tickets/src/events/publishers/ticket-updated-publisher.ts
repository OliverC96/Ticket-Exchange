import { Publisher, Subjects, TicketUpdatedEvent } from "@ojctickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject= Subjects.TicketUpdated;
}