import { Publisher, Subjects, TicketUpdatedEvent } from "@ojctickets/common";

/**
 * Informs other services that an existing ticket has been updated/modified
 * @extends Publisher
 */
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject= Subjects.TicketUpdated;
}