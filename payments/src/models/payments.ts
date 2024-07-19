import mongoose from "mongoose";

interface PaymentFields {
    orderID: string,
    chargeID: string
}

interface PaymentDocument extends mongoose.Document {
    orderID: string,
    chargeID: string
}

interface PaymentModel extends mongoose.Model<PaymentDocument> {
    build(fields: PaymentFields): PaymentDocument;
}

const paymentSchema = new mongoose.Schema(
    {
        orderID: {
            type: String,
            required: true
        },
        chargeID: {
            type: String,
            required: true
        },
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

paymentSchema.statics.build = (fields: PaymentFields) => {
    return new Payment(fields);
}

export const Payment: PaymentModel = mongoose.model<PaymentDocument, PaymentModel>("Payment", paymentSchema);