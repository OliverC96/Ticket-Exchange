import { Publisher, Subjects, TicketCreatedEvent } from "@ojctickets/common";

/**
 * Informs other services that a new ticket has been created
 * @extends Publisher
 */
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject= Subjects.TicketCreated;
}