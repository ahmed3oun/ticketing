
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

            const newTicket = await this.ticketsService.create(body);
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

            /* const currentUser = this.getCurrentUser();
            const body = this.getBody() as ITicket

            if (validator.isEmpty(body.title) || validator.isFloat(body.price.toString(), {
                gt: 0
            })) {
                throw new ErrorHandler("Ticket must have a title and its price must be greater than 0", 400);
            }

            const newTicket = await this.ticketsService.create(body);
            if (!newTicket) {
                throw new ErrorHandler('Ticket didn\'t created as expected...', 500);
            } */
            this.sendResponse({}, 201)
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/find/:id
    async findById() {
        try {

            /* const currentUser = this.getCurrentUser();
            const body = this.getBody() as ITicket

            if (validator.isEmpty(body.title) || validator.isFloat(body.price.toString(), {
                gt: 0
            })) {
                throw new ErrorHandler("Ticket must have a title and its price must be greater than 0", 400);
            }

            const newTicket = await this.ticketsService.create(body);
            if (!newTicket) {
                throw new ErrorHandler('Ticket didn\'t created as expected...', 500);
            } */
            this.sendResponse({}, 200)
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/update/:id
    async update() {
        try {

            /* const currentUser = this.getCurrentUser();
            const body = this.getBody() as ITicket

            if (validator.isEmpty(body.title) || validator.isFloat(body.price.toString(), {
                gt: 0
            })) {
                throw new ErrorHandler("Ticket must have a title and its price must be greater than 0", 400);
            }

            const newTicket = await this.ticketsService.create(body);
            if (!newTicket) {
                throw new ErrorHandler('Ticket didn\'t created as expected...', 500);
            } */
            this.sendResponse({}, 200)
        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /tickets/patch
    async patch() {
        try {

            /* const currentUser = this.getCurrentUser();
            const body = this.getBody() as ITicket

            if (validator.isEmpty(body.title) || validator.isFloat(body.price.toString(), {
                gt: 0
            })) {
                throw new ErrorHandler("Ticket must have a title and its price must be greater than 0", 400);
            }

            const newTicket = await this.ticketsService.create(body);
            if (!newTicket) {
                throw new ErrorHandler('Ticket didn\'t created as expected...', 500);
            } */
            this.sendResponse({}, 201);
        } catch (error: any) {
            return this.sendError(error);
        }
    }
}

export default TicketsApiController;