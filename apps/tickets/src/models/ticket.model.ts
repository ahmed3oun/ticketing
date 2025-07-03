import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
<<<<<<< HEAD
import Order from './order.model';
import { OrderStatus } from '../utils/nats/types/order-status.enum';
=======
>>>>>>> 9db7e17 (updtate project arch and complete tickets feature with its unit tests: tickets ms and upd infra)

interface ITicket {
    title: string;
    price: number;
    userId: string;
}

// user document interface
interface TicketDoc extends mongoose.Document<ITicket> {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
<<<<<<< HEAD
    isReserved(): Promise<boolean>; // Method to check if the ticket is reserved
=======
>>>>>>> 9db7e17 (updtate project arch and complete tickets feature with its unit tests: tickets ms and upd infra)
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: ITicket): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
        },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt fields
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id; // Add id field
                delete ret._id; // Remove _id field
            }
        }
    }
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);



// userSchema.index({ title: 1 }, { unique: true });

ticketSchema.statics.build = (attrs: ITicket) => {
    return new Ticket(attrs);
}

<<<<<<< HEAD
ticketSchema.methods.isReserved = async function (): Promise<boolean> {
    const existingOrder = await Order.findOne({
        ticket: this as any, // 'this' refers to the Ticket model
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ] // Check for orders that are not completed or cancelled
        }
    });
    return !!existingOrder; // Return true if an order exists, false otherwise
}

=======
>>>>>>> 9db7e17 (updtate project arch and complete tickets feature with its unit tests: tickets ms and upd infra)
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;
export { ITicket, TicketDoc, TicketModel }; // Export interfaces for use in other parts of the application