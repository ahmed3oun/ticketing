
import { Request, Response } from "express";
import ErrorHandler from "../utils/errors/error-handler";
import BaseApiController from "./base-api.controller";



class AuthApiController extends BaseApiController {

    constructor(
        protected readonly req: Request,
        protected readonly res: Response
    ) {
        super(req, res)
    }
    // /auth/signin
    async signin() {
        // TODO: user sign in
        try {

            const { email, password } = this.getBody() as { email: string; password: string; };
            if (!email || !password) {
                throw new ErrorHandler('Login and Password are required', 400);
            }
            if (!validator.isEmail(email)) {
                throw new ErrorHandler('Login must be a valid email address', 400);
            } else if (password.length < 6) {
                throw new ErrorHandler('Password must contain at least 6 characters', 400);
            }
            const user = await this.userService.getUserByEmail(email);

            if (!user) {
                throw new ErrorHandler('User with this email does not exist', 400);
            }

            const isMatchedPwd = await bcryptjs.compare(password, user.password);
            if (!isMatchedPwd) {
                throw new ErrorHandler('Password is incorrect', 400);
            }

            const token = jwt.sign({
                id: user.id,
                email: user.email,
            }, configService.get('JWT_KEY')!);

            this.req.session = {
                jwt: token
            }

            return this.res.status(200).send(user)

        } catch (error: any) {
            return this.sendResponseError({
                error: new ErrorHandler({
                    message: error.message,
                    statusCode: error.statusCode
                })
            })
        }
    }
    // /auth/signup
    async signup() {
        try {

            const { email, password } = this.getBody() as { email: string; password: string; };
            if (!email || !password) {
                throw new ErrorHandler('Login and Password are required', 400);
            }
            if (!validator.isEmail(email)) {
                throw new ErrorHandler('Login must be a valid email address', 400);
            } else if (password.length < 6) {
                throw new ErrorHandler('Password must contain at least 6 characters', 400);
            }

            const user = await this.userService.getUserByEmail(email);

            if (user) {
                throw new ErrorHandler('User with this email already exists', 400);
            }

            const newUser = await this.userService.createUser({
                email,
                password
            });

            const token = jwt.sign({
                id: newUser.id,
                email: newUser.email,
            }, configService.get('JWT_KEY')!);
            if (!token) {
                throw new ErrorHandler('Failed to create JWT token', 500);
            }
            this.req.session = {
                jwt: token
            }

            return this.res.status(201).send(newUser);

        } catch (error: any) {
            return this.sendError(error);
        }
    }
    // /user/signout
    async signout() {
        try {
            this.req.session = null;
            return this.res.status(204).send();

        } catch (error: any) {
            return this.sendResponseError({
                error: new ErrorHandler({
                    message: error.message,
                    statusCode: error.statusCode
                })
            })
        }
    }
}

export default AuthApiController;