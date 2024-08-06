import mongoose from "mongoose";
import { OrderStatus } from "@ojctickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface OrderFields {
    id: string,
    version: number,
    userID: string,
    price: number,
    status: OrderStatus
}

export interface OrderDocument extends mongoose.Document {
    version: number,
    userID: string,
    price: number
    status: OrderStatus,
}

interface OrderModel extends mongoose.Model<OrderDocument> {
    build(fields: OrderFields): OrderDocument;
    findByEvent(event: { id: string, version: number}): Promise<OrderDocument | null>;
}

const orderSchema = new mongoose.Schema(
{
            userID: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                required: true,
                enum: Object.values(OrderStatus),
                default: OrderStatus.Created
            }
        },
{
            toJSON: {
                transform(doc, ret) {
                    ret.id = ret._id;
                    delete ret._id;
                },
            }
        }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin); // Enable optimistic concurrency control

orderSchema.statics.build = (fields: OrderFields) => {
    const { id, ...rest } = fields;
    return new Order({
        _id: fields.id,
        ...rest
    });
};

/**
 * Helper method which retrieves an order matching the provided id and version number
 * @param {Object} event
 * @param {string} event.id The id associated with the order
 * @param {number} event.version The current version number of the order document
 * @returns {OrderDocument|null} The matching order document (if it exists)
 */
orderSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

export const Order: OrderModel = mongoose.model<OrderDocument, OrderModel>('User', orderSchema);