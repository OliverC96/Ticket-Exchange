import mongoose from "mongoose";
import { Order, OrderStatus } from "./orders";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface TicketFields {
    id: string,
    title: string,
    price: number
}

export interface TicketDocument extends mongoose.Document {
    title: string,
    price: number,
    version: number,
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(fields: TicketFields): TicketDocument,
    findByEvent(event: { id: string, version: number}): Promise<TicketDocument | null>;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
        versionKey: "version"
    }
);

// Enable optimistic concurrency control
ticketSchema.plugin(updateIfCurrentPlugin);

/**
 * Helper method which retrieves a ticket matching the provided id and version number
 * @param {Object} event
 * @param {string} event.id The id associated with the ticket
 * @param {number} event.version The current version number of the ticket document
 * @returns {OrderDocument|null} The matching ticket document (if it exists)
 */
ticketSchema.statics.findByEvent = (event: { id: string, version: number }): Promise<TicketDocument | null> => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

ticketSchema.statics.build = (fields: TicketFields) => {
    const { id, ...rest } = fields;
    return new Ticket({
        _id: id,
        ...rest
    });
};

/**
 * Helper method which determines whether the ticket is currently reserved (i.e., linked with a valid order)
 * @returns {boolean} True if the ticket is reserved; false otherwise
 */
ticketSchema.methods.isReserved = async function(): Promise<boolean> {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });
    return existingOrder !== null;
};

export const Ticket = mongoose.model<TicketDocument, TicketModel>("Ticket", ticketSchema);
