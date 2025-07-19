import express, { Express, Request, Response } from "express";
import compression from 'compression';
import cors from 'cors';
import routes from './routes/api';
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
app.get('/health', (req: Request, res: Response) => {
    res.status(200).send({
        message: 'OK',
        status: 200,
        error: null,
    });
});

app.use('/api/v1', routes);






export default app;