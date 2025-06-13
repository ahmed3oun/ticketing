
import { Request, Response } from "express";
import ErrorHandler from "../utils/errors/error-handler";
import BaseApiController from "./base-api.controller";
import UserService from '../services/user.service';



class UserApiController extends BaseApiController {

    private readonly userService: UserService = new UserService();

    constructor(
        protected readonly req: Request,
        protected readonly res: Response
    ) {
        super(req, res)
    }

    // /user/get-current-user
    async getMe() {
        try {
            // TODO: user sign out

        } catch (error: any) {
            return this.sendError(error);
        }
    }
}

export default UserApiController;