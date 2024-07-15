import { Publisher, Subjects, TicketCreatedEvent } from "@ojctickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject= Subjects.TicketCreated;
}