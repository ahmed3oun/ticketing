import ErrorHandler from "../utils/errors/error-handler";
import Order, { IOrder, OrderDoc } from "../models/order.model";
import { OrderStatus } from "../utils/nats/types/order-status.enum";

export default class OrdersService {

    // Add methods for order service here
    // For example, createOrder, getOrderById, updateOrder, deleteOrder, etc.

    constructor() { }
    /**
     * Creates a new order in the database.
     * @param orderData - The data for the new order.
     * @returns The created order document.
     */
    async create(orderData: IOrder): Promise<OrderDoc> {
        const order = Order.build(orderData);
        await order.save();
        return order;
    }

    /**
     * Get a specific order in the database.
     * @param orderId - The data for the specific Order Id.
     * @returns The found order document.
     */
    async getById(orderId: string) {
        const order = await Order.findById(orderId).populate('ticket'); // Populate the ticket field to get ticket details
        if (!order) {
            throw new ErrorHandler(`Order with ID ${orderId} not found`, 404);
        }
        return order;
    }

    /**
     * @description This method retrieves all orders.
     * @returns The found orders documents.
     */
    async getAll(userId: string) {
        const orders = await Order.find({
            userId
        }).populate('ticket'); // Populate the ticket field to get ticket details
        console.log({
            orders
        });

        if (!orders) {
            throw new ErrorHandler("No tickets found", 404);
        }
        return orders;
    }

    /**
     * Updates a specific order in the database.
     * @param orderId - The ID of the order to update.
     * @param orderData - The data to update the order with.
     * @returns The updated order document.
     */
    async update(orderId: string, orderData: IOrder) {
        const order = await Order.findByIdAndUpdate(orderId, orderData, {
            new: true, // Return the updated document
            runValidators: true, // Validate the updated data against the schema
            context: 'query', // Ensure that the validation context is set correctly
        });
        if (!order) {
            throw new ErrorHandler(`Order with ID ${orderId} not found`, 404);
        }
        return order;
    }

    /**
     * Deletes a specific order in the database.
     * @param orderId - The ID of the order to delete.
     * @returns The deleted order document.
     */
    async delete(orderId: string) {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new ErrorHandler(`Order with ID ${orderId} not found`, 404);
        }
        order.set({ status: OrderStatus.Cancelled }); // Set the status to cancelled instead of deleting
        await order.save();
        return order;
    }
}