import { OrderStatus } from "../utils/nats/types/order-status.enum";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket.model";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface IOrder {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

// order document interface
interface OrderDoc extends mongoose.Document<IOrder> {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: IOrder): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus), // Ensure status is one of the OrderStatus enum values
            default: OrderStatus.Created, // Default status when creating an order
        },
        expirsAt: {
            type: mongoose.Schema.Types.Date,
        },
        Ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true, // Ensure that a ticket is associated with the order
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin); // Plugin to handle optimistic concurrency control

orderSchema.statics.build = (attr: IOrder) => {
    return new Order(attr);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { OrderDoc, IOrder, OrderModel };
export default Order;


