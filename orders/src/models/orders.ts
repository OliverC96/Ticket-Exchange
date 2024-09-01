import mongoose from "mongoose";
import { OrderStatus } from "@ojctickets/common";
import { TicketDocument } from "./tickets";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export { OrderStatus };

export interface OrderFields {
    userID: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDocument
}

export interface OrderDocument extends mongoose.Document {
    userID: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDocument,
    version: number
}

interface OrderModel extends mongoose.Model<OrderDocument> {
    build(fields: OrderFields): OrderDocument
}

const orderSchema = new mongoose.Schema(
{
            userID: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true,
                enum: Object.values(OrderStatus),
                default: OrderStatus.Created
            },
            expiresAt: {
                type: mongoose.Schema.Types.Date,
                required: false
            },
            ticket: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ticket"
            }
        },
{
            toJSON: {
                transform(doc, ret) {
                    ret.id = ret._id;
                    delete ret._id;
                }
            },
            versionKey: "version"
        }
);

// Enable optimistic concurrency control
orderSchema.plugin(updateIfCurrentPlugin);

/**
 * Adding a static method to the orders model (TypeScript workaround)
 * @param fields The parameters of the new document
 * @return The newly created document
 */
orderSchema.statics.build = (fields: OrderFields) => {
    return new Order(fields);
}

export const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);