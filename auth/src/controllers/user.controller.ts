
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

            const currentUser = this.getCurrentUser();
            console.log('Current User:', currentUser);

            if (!currentUser) {
                throw new ErrorHandler('Not authenticated', 401);
            }
            this.res.status(200).send({
                currentUser
            });

        } catch (error: any) {
            return this.sendError(error);
        }
    }
}

export default UserApiController;