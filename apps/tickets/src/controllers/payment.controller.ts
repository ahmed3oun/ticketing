
import { Request, Response } from "express";
import ErrorHandler from "../utils/errors/error-handler";
import BaseApiController from "./base-api.controller";
import { OrderStatus } from "../utils/nats/types/order-status.enum";
import Payment, { IPayment } from "../models/payment.model";
import OrdersService from '../services/orders.service';
// import { IOrder } from "../models/order.model";
import * as validator from "validator";
import stripe from "../utils/stripe/";
// import { OrderStatus } from "../utils/nats/types/order-status.enum";
// import { OrderCreatedPublisher } from "../events/publishers/order-created.publisher";
// import { natsWrapper } from "../utils/nats/nats.wrapper";
// import { OrderCancelledPublisher } from "../events/publishers/order-cancelled.publisher";



class PaymentsApiController extends BaseApiController {

    private readonly ordersService: OrdersService = new OrdersService();

    constructor(
        protected readonly req: Request,
        protected readonly res: Response
    ) {
        super(req, res)
    }

    // /payments/create
    async create() {
        try {
            const currentUser = this.getCurrentUser();
            const paymentData = this.getBody() as { token: string; orderId: string; }


            if (
                validator.isEmpty(paymentData.orderId) ||
                validator.isMongoId(paymentData.orderId) === false
            ) {
                return this.sendError(new ErrorHandler("Order ID is required", 400));
            }

            const order = await this.ordersService.getById(paymentData.orderId);

            if (order.userId !== currentUser!.id) {
                throw new ErrorHandler("You are not authorized to create a payment for this order", 403);
            }

            if (order.status === OrderStatus.Cancelled) {
                throw new ErrorHandler("Cannot create payment for a cancelled order", 400);
            }

            const charge = await stripe.charges.create({
                currency: 'usd',
                amount: order.ticket.price * 100, // Convert to cents
                source: paymentData.token, // This should be a valid Stripe token or source ID
                description: `Payment for order ${order.id}`,
            })

            if (!charge || !charge.id) {
                throw new ErrorHandler("Payment failed", 500);
            }

            const payment = Payment.build({
                orderId: order.id,
                stripeId: charge.id,
            })

            await payment.save();

            this.sendResponse(payment, 201)

        } catch (error: any) {
            return this.sendError(error);
        }
    }

    async find() {
        try {
            // const currentUser = this.getCurrentUser();
            this.sendError(new ErrorHandler("This endpoint is not implemented yet", 501));

        } catch (error: any) {
            return this.sendError(error);
        }
    }
}

export default PaymentsApiController;