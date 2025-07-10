
import { Request, Response } from "express";
import ErrorHandler from "../utils/errors/error-handler";
import BaseApiController from "./base-api.controller";
import OrdersService from '../services/orders.service';
import { IOrder } from "../models/order.model";
import * as validator from "validator";
import TicketsService from '../services/tickets.service';
import { OrderStatus } from "@/utils/nats/types/order-status.enum";
import { OrderCreatedPublisher } from "@/events/publishers/order-created.publisher";
import { natsWrapper } from "@/utils/nats/nats.wrapper";
import { OrderCancelledPublisher } from "@/events/publishers/order-cancelled.publisher";



class OrdersApiController extends BaseApiController {

    private readonly ordersService: OrdersService = new OrdersService();
    private readonly ticketsService: TicketsService = new TicketsService();
    private readonly EXPIRATION_WINDOW_SECONDS = 1 * 60;

    constructor(
        protected readonly req: Request,
        protected readonly res: Response
    ) {
        super(req, res)
    }

    // /orders/create
    async create() {
        try {
            const currentUser = this.getCurrentUser();
            const body = this.getBody() as { ticketId: string };
            if (!body.ticketId || !validator.isMongoId(body.ticketId)) {
                throw new ErrorHandler("Invalid ticket ID", 400);
            }
            const ticket = await this.ticketsService.getById(body.ticketId);
            if (!ticket) {
                throw new ErrorHandler("Ticket not found", 404);
            }
            if (await ticket.isReserved()) {
                throw new ErrorHandler("Ticket is already reserved", 400);
            }
            const expiresAt = new Date();
            expiresAt.setSeconds(expiresAt.getSeconds() + this.EXPIRATION_WINDOW_SECONDS);
            const order = await this.ordersService.create({
                userId: currentUser!.id,
                ticket,
                expiresAt,
                status: OrderStatus.Created
            });

            new OrderCreatedPublisher(natsWrapper.client!).publish({
                id: order.id,
                userId: order.userId,
                expiresAt: order.expiresAt.toISOString(),
                version: order.version,
                status: OrderStatus.Created,
                ticket: {
                    id: ticket.id,
                    price: ticket.price
                }
            })

            return this.sendResponse(order, 201);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /orders/find
    async find() {
        try {
            const currUser = this.getCurrentUser()
            const orders = this.ordersService.getAll(currUser!.id)
            return this.sendResponse(orders, 200);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /orders/find/:id
    async findById() {
        try {
            const { id } = this.getParams();
            const currUser = this.getCurrentUser();
            const order = await this.ordersService.getById(id);
            if (order.userId !== currUser!.id) {
                throw new ErrorHandler('Not authorized', 401)
            }
            return this.sendResponse(order, 200);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/update/:id
    async update() {
        try {
            this.sendError(new ErrorHandler("This endpoint is not implemented yet", 501));
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/delete/:id
    async delete() {
        try {
            const currUser = this.getCurrentUser();
            const { id } = this.getParams();
            const order = await this.ordersService.getById(id);
            if (order.userId !== currUser!.id) {
                new ErrorHandler('Not authorized', 401)
            }
            const cancelledOrder = await this.ordersService.delete(order.id);
            new OrderCancelledPublisher(natsWrapper.client!).publish({
                id: order.id,
                version: order.version,
                ticket: {
                    id: order.ticket.id
                }
            })

            return this.sendResponse(cancelledOrder, 200);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
}

export default OrdersApiController;