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
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (fields: OrderFields) => {
    const { id, ...rest } = fields;
    return new Order({
        _id: fields.id,
        ...rest
    });
};

orderSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1
    });
}

export const Order: OrderModel = mongoose.model<OrderDocument, OrderModel>('User', orderSchema);