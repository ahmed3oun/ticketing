
import { Request, Response } from "express";
import ErrorHandler from "../utils/errors/error-handler";
import BaseApiController from "./base-api.controller";
import TicketsService from '../services/tickets.service';
import { ITicket } from "../models/ticket.model";
import * as validator from "validator";



class TicketsApiController extends BaseApiController {

    private readonly ticketsService: TicketsService = new TicketsService();

    constructor(
        protected readonly req: Request,
        protected readonly res: Response
    ) {
        super(req, res)
    }

    // /tickets/create
    async create() {
        try {

            const currentUser = this.getCurrentUser();
            const body = this.getBody() as ITicket

            if (validator.isEmpty(body.title) || validator.isFloat(body.price.toString(), {
                gt: 0
            })) {
                throw new ErrorHandler("Ticket must have a title and its price must be greater than 0", 400);
            }

            const newTicket = await this.ticketsService.create({
                price: body.price,
                title: body.title,
                userId: currentUser!.id,
            });
            if (!newTicket) {
                throw new ErrorHandler('Ticket didn\'t created as expected...', 500);
            }
            this.sendResponse(newTicket, 201)
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/find
    async find() {
        try {
            const tickets = await this.ticketsService.getAll();

            this.sendResponse(tickets, 200)
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/find/:id
    async findById() {
        try {
            const { id } = this.getParams();
            const currentTicket = await this.ticketsService.getById(id);

            this.sendResponse(currentTicket, 200)
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/update/:id
    async update() {
        try {

            const currentUser = this.getCurrentUser();
            const body = this.getBody() as ITicket
            const ticketId = this.getParams().id;

            if (validator.isEmpty(body.title) || validator.isFloat(body.price.toString(), {
                gt: 0
            })) {
                throw new ErrorHandler("Ticket must have a title and its price must be greater than 0", 400);
            }

            if (!validator.isMongoId(ticketId)) {
                throw new ErrorHandler("Ticket must have a valid id", 400);
            }

            if (currentUser!.id !== body.userId) {
                throw new ErrorHandler("You are not allowed to update this ticket", 403);
            }

            const ticket = await this.ticketsService.getById(ticketId);
            if (ticket.orderId) {
                throw new ErrorHandler("Cannot update an ordered ticket", 400);
            }

            const updatedTicket = await this.ticketsService.update(ticketId, body);

            this.sendResponse(updatedTicket, 200);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/patch
    async patch() {
        try {
            throw new ErrorHandler("This endpoint is not implemented yet", 501);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
}

export default TicketsApiController;