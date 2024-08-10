import { Publisher, Subjects, TicketDeletedEvent } from "@ojctickets/common";

/**
 * Informs other services that a ticket has been permanently deleted
 * @extends Publisher
 */
export class TicketDeletedPublisher extends Publisher<TicketDeletedEvent> {
    readonly subject = Subjects.TicketDeleted;
}