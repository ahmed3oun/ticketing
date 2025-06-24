import ErrorHandler from "../utils/errors/error-handler";
import Ticket, { ITicket, TicketDoc } from "../models/ticket.model";

export default class TicketsService {
    // Add methods for user service here
    // For example, createTicket, getTicketById, updateTicket, deleteTicket, etc.

    constructor() { }
    /**
     * Creates a new user in the database.
     * @param ticketData - The data for the new ticket.
     * @returns The created user document.
     */
    async create(ticketData: ITicket): Promise<TicketDoc> {
        // Logic to create a user
        const ticket  = Ticket.build(ticketData);
        await ticket.save();
        return ticket;
    }

    async getById(ticketId: string) {
        // Logic to get a ticket by ID
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new ErrorHandler(`Ticket with ID ${ticketId} not found`, 404);
        }
        return ticket;
    }

    async update(ticketId: string, ticketData: ITicket) {
        // Logic to update a ticket
        const ticket = await Ticket.findByIdAndUpdate(ticketId, ticketData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the updated data against the schema
            context: 'query', // Ensure that the validation context is set correctly
        });
        if (!ticket) {
            throw new ErrorHandler(`Ticket with ID ${ticketId} not found`, 404);
        }
        return ticket;
    }
}