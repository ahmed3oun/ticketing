import mongoose from "mongoose";


interface IPayment {
    orderId: string;
    stripeId: string;
}

// payment document interface
interface PaymentDoc extends mongoose.Document<IPayment> {
    orderId: string;
    stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: IPayment): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true, // Ensure that a payment is associated with an order
        },
        stripeId: {
            type: String,
            required: true, // Stripe payment identifier
        }
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id; // Add id field
                delete ret._id; // Remove _id field
            }
        }
    })

paymentSchema.statics.build = (attr: IPayment) => {
    return new Payment({
        orderId: attr.orderId,
        stripeId: attr.stripeId,
    });
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);


Payment.collection.createIndex({ orderId: 1 });

export { PaymentDoc, IPayment, PaymentModel };
export default Payment;


