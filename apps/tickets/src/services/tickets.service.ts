import ErrorHandler from "../utils/errors/error-handler";
import Ticket, { ITicket, TicketDoc } from "../models/ticket.model";

export default class TicketsService {

    // Add methods for ticket service here
    // For example, createTicket, getTicketById, updateTicket, deleteTicket, etc.

    constructor() { }
    /**
     * Creates a new ticket in the database.
     * @param ticketData - The data for the new ticket.
     * @returns The created ticket document.
     */
    async create(ticketData: ITicket): Promise<TicketDoc> {
        // Logic to create a user
        const ticket = Ticket.build(ticketData);
        await ticket.save();
        return ticket;
    }

    /**
     * Get a specific ticket in the database.
     * @param ticketId - The data for the specefic Ticket Id.
     * @returns The found ticket document.
     */
    async getById(ticketId: string) {
        // Logic to get a ticket by ID
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new ErrorHandler(`Ticket with ID ${ticketId} not found`, 404);
        }
        return ticket;
    }

    /**
     * @description This method retrieves all tickets that are not associated with an order.
     * @returns The founded tickets documents.
     */
    getAll() {
        const tickets = Ticket.find({
            orderId: undefined // Only return tickets that are not associated with an order
        });
        if (!tickets) {
            throw new ErrorHandler("No tickets found", 404);
        }
        return tickets;
    }

    /**
     * Updates a specific ticket in the database.
     * @param ticketId - The ID of the ticket to update.
     * @param ticketData - The data to update the ticket with.
     * @returns The updated ticket document.
     */
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