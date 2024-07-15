import mongoose from "mongoose";

export interface TicketType {
    title: string,
    price: number
}

interface TicketFields extends TicketType {
    userID: string
}

export interface TicketDocument extends mongoose.Document {
    title: string,
    price: number,
    userID: string
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build(fields: TicketFields): TicketDocument;
}

const ticketSchema: mongoose.Schema = new mongoose.Schema(
{
            title: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            userID: {
                type: String,
                required: true
            }
        },
{
            toJSON: {
                transform(doc, ret) {
                    ret.id = ret._id;
                    delete ret._id;
                },
            },
        }
);

/**
 * Adding a static method to the tickets model (TypeScript workaround)
 * @param fields The parameters of the new document
 * @return The newly created document
 */
ticketSchema.statics.build = (fields: TicketFields) => {
    return new Ticket(fields);
}

export const Ticket: TicketModel = mongoose.model<TicketDocument, TicketModel>('Ticket', ticketSchema);