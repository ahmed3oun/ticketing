import ErrorHandler from "../utils/errors/error-handler";
import Payment, { IPayment, PaymentDoc } from "../models/payment.model";


export default class PaymentsService {

    // Add methods for payment service here
    // For example, createPayment, getPaymentById, getAll, etc.

    constructor() { }
    /**
     * Creates a new payment in the database.
     * @param paymentData - The data for the new payment.
     * @returns The created payment document.
     */
    async create(paymentData: IPayment): Promise<PaymentDoc> {
        const payment = Payment.build(paymentData);
        await payment.save();
        return payment;
    }

    /**
     * Get a specific order in the database.
     * @param orderId - The data for the specific Order Id.
     * @returns The found order document.
     */
    async getById(paymentId: string) {
        const payment = await Payment.findById(paymentId).populate('order'); // Populate the order field to get order details
        if (!payment) {
            throw new ErrorHandler(`Payment with ID ${paymentId} not found`, 404);
        }
        return payment;
    }

    /**
     * @description This method retrieves all orders.
     * @returns The found orders documents.
     */
    async getAll(userId?: string) {
        const payments = await Payment.find()
            .populate({
                path: 'order', // Populate the order field to get order details
                match: userId ? { userId } : {}, // Optionally filter by userId
            });
        if (!payments || payments.length === 0) {
            throw new ErrorHandler("No payments found", 404);
        }

        return payments;
    }
}