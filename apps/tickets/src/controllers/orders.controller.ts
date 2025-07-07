
import { Request, Response } from "express";
import ErrorHandler from "../utils/errors/error-handler";
import BaseApiController from "./base-api.controller";
import OrdersService from '../services/orders.service';
import { IOrder } from "../models/order.model";
import * as validator from "validator";



class OrdersApiController extends BaseApiController {

    private readonly ordersService: OrdersService = new OrdersService();

    constructor(
        protected readonly req: Request,
        protected readonly res: Response
    ) {
        super(req, res)
    }

    // /orders/create
    async create() {
        try {
            throw new ErrorHandler("This endpoint is not implemented yet", 501);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /orders/find
    async find() {
        try {
            throw new ErrorHandler("This endpoint is not implemented yet", 501);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /orders/find/:id
    async findById() {
        try {
            throw new ErrorHandler("This endpoint is not implemented yet", 501);
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
            throw new ErrorHandler("This endpoint is not implemented yet", 501);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
}

export default OrdersApiController;