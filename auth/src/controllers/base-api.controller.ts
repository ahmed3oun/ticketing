import ErrorHandler from "../utils/errors/error-handler";
import { Request, Response } from "express";


interface CurrentUser {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: CurrentUser; // Optional current user object
        }
    }
}

export default class BaseApiController {

    constructor(
        protected readonly req: Request,
        protected readonly res: Response
    ) { }

    getParams(): Record<string, any> {
        return this.req.params || {};
    }
    getQuery(): Record<string, any> {
        return this.req.query || {};
    }
    getBody(): Record<string, any> {
        return this.req.body || {};
    }
    getBodyField<T>(field: string): T | undefined {
        return this.req.body[field] as T | undefined;
    }
    getHeaders(): Record<string, any> {
        return this.req.headers || {};
    }
    getCookies(): Record<string, any> {
        return this.req.cookies || {};
    }
    getIp(): string {
        return this.req.ip || this.req.connection.remoteAddress || '';
    }
    getCurrentUser(): CurrentUser | null {
        return this.req.currentUser || null;
    }
    getAuthorization(): string | undefined {
        const authHeader = this.req.headers['authorization'];
        if (typeof authHeader === 'string') {
            return authHeader;
        }
        return undefined;
    }
    getPaginationParams(): { page: number; limit: number; offset: number } {
        const page = parseInt(this.req.query.page as string) || 1;
        const limit = parseInt(this.req.query.limit as string) || 10;
        const offset = (page - 1) * limit;
        return { page, limit, offset };
    }
    sendResponse<T>(data: T | unknown, statusCode: number = 200): Response {
        return this.res.status(statusCode).json({
            success: true,
            data: data,
            message: 'Request successful'
        });
    }
    sendError(error: ErrorHandler): Response {
        console.error('Error:', error);
        return this.res.status(error.statusCode).json({
            success: false,
            error: {
                message: error.message || 'An error occurred',
                details: error.details || null
            }
        });
    }
}