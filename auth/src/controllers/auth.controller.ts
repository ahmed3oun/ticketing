
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
            const {
                login,
                password
            } = this.getBody()

            const body: signinBody = {
                login: cleanString(login)!.toLowerCase(),
                password: String(password!).trim()
            }

            if (validator.isEmpty(body.login!) || validator.isEmpty(body.password!)) {
                throw new ErrorHandler({
                    message: 'Login and Password are required',
                    statusCode: 400
                });
            } else if (body.password?.length! < 6) {
                throw new ErrorHandler({
                    message: 'Password must contains at least 6 characters',
                    statusCode: 400
                });
            } else if (!validator.isEmail(body.login!) && body.login!.length <= 30) {
                // Login as username
                const is_existed = await userService.isExistsByUsername({
                    username: body.login!
                })
                if (!is_existed) {
                    throw new ErrorHandler({
                        message: 'Unexisted Username',
                        statusCode: 400
                    });
                } else {
                    const user = await userService.findByUsername({
                        username: body.login!
                    })

                    if (!user?.comparePassword(body.password!)) {
                        throw new ErrorHandler({
                            message: 'Password is incorrect',
                            statusCode: 401,
                        })
                    }

                    if (!user.is_verified) {
                        throw new ErrorHandler({
                            message: 'Account is not activated! Check your email',
                            statusCode: 400
                        });
                    }

                    const login_data = await authService.generateLoginData({
                        user
                    })

                    return this.response.status(200).send({
                        success: true,
                        message: 'Logged In successfully',
                        ...login_data
                    })
                }

            } else if (validator.isEmail(body.login!)) {
                // login as email address
                const is_existed = await userService.isExists({
                    email: body.login!
                })
                if (!is_existed) {
                    throw new ErrorHandler({
                        message: 'Unexisted Email',
                        statusCode: 400
                    });
                } else {
                    const user = await userService.findByEmail({
                        email: body.login!
                    })
                    const isMatchedPwd = user?.comparePassword(body.password!)
                    if (!isMatchedPwd) {
                        throw new ErrorHandler({
                            message: 'Password is incorrect',
                            statusCode: 401,
                        })
                    }

                    if (!user!.is_verified) {
                        throw new ErrorHandler({
                            message: 'Account is not activated! Check your email',
                            statusCode: 400
                        });
                    }

                    const login_data = await authService.generateLoginData({
                        user: user!
                    })

                    return this.response.status(200).send({
                        success: true,
                        message: 'Logged In successfully',
                        ...login_data
                    })
                }
            } else {
                throw new ErrorHandler({
                    message: 'Invalid login',
                    statusCode: 401
                });
            }

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
            const {
                username,
                email,
                first_name,
                last_name,
                password,
                role,
                phone
            } = this.getBody()

            const body: signupBody = {
                username: cleanString(username)!.toLowerCase(),
                email: email.trim().toLowerCase(),
                first_name: cleanString(first_name)!,
                last_name: cleanString(last_name)!,
                password,
                role: role.trim().toUpperCase(),
                phone: phone.trim()
            }

            if (!email || !validator.isEmail(email)) {
                throw new ErrorHandler({
                    message: `Email is required with valid format.`,
                    statusCode: 400
                })
            } else if (!username || !(String(body.username).trim().length > 0 && String(username).trim().length <= 30)) {
                throw new ErrorHandler({
                    message: `Username is required and cannot be longer than 30 characters.`,
                    statusCode: 400
                })
            } else if (!password || String(body.password).trim().length < 6) {
                throw new ErrorHandler({
                    message: `Password must have at least 6 characters`,
                    statusCode: 400
                })
            } else if (!body.role || !([
                String(Role.Admin),
                String(Role.Doctor),
                String(Role.Patient)
            ].includes(String(body.role)))) {
                throw new ErrorHandler({
                    message: `Role is required and cannot be different to (${Role.Admin}, ${Role.Doctor}, ${Role.Patient})`,
                    statusCode: 400
                })

            } else if (!body.phone || !(validator.isMobilePhone(body.phone!))) {
                throw new ErrorHandler({
                    message: `Phone is required with valid format`,
                    statusCode: 400
                })
            }

            const is_exists = await userService.isExists({ email: body.email! })

            if (is_exists) {
                throw new ErrorHandler({
                    message: `Email address is already exists`,
                    statusCode: 400
                });
            }

            const new_user = await userService.create({ body })

            const {
                preview
            } = await authService.sendWelcomeEmail({
                user: new_user
            })

            return this.response.status(201).json({
                success: true,
                message: 'Registered successfully!',
                ...new_user,
                preview
            })

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