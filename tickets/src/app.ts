import express, { Express, Request, Response } from "express";
import compression from 'compression';
import cors from 'cors';
import apiRouter from './routes/api';
import cookieSession from "cookie-session";


const app: Express = express();
app.set('trust proxy', true);

app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test', // Use secure cookies in production
        sameSite: 'strict', // Prevent CSRF attacks
    })
);
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('public', express.static(__dirname + '/public'));

// Define a simple health check route
app.get('/api/v1/tickets/health', (req: Request, res: Response) => {
    res.status(200).send({
        message: 'tickets service works fine!!!!',
        status: 200,
        error: null,
    });
});
// curl http://ticketing.dev/api/v1/tickets/health

app.use('/api/v1', apiRouter);


export default app;