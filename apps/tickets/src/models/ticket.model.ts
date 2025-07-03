import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

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

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export default Ticket;
export { ITicket, TicketDoc, TicketModel }; // Export interfaces for use in other parts of the application