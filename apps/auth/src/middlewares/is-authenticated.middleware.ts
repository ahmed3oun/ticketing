import { CurrentUser } from "../controllers/base-api.controller";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';

const istAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.session?.jwt;
    if (!token) {
        res.status(401).send({ message: 'Not authenticated' });
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_KEY!) as CurrentUser;
        req.currentUser = payload; // Assuming req.currentUser is defined in your Request interface
        next();
    } catch (error) {
        res.status(401).send({ message: 'Not authenticated' });
    }
}

export default istAuthenticated;