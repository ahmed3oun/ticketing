import express, { Express, NextFunction, Request, Response } from "express";
import compression from 'compression';
import cors from 'cors';
import apiRouter from './routes/api';
import cookieSession from "cookie-session";
import Redis, { RedisKey } from 'ioredis'
import configService from "./utils/config/config-service";


const app: Express = express();
const redis = new Redis(configService.getOrElseThrow('REDIS_HOST'))
app.set('trust proxy', true);

app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        // secure: process.env.NODE_ENV !== 'test', // Use secure cookies in production
        secure: false, // Use secure cookies in production
        httpOnly: true, // Prevent client-side JS from accessing the cookie
        sameSite: 'strict', // Prevent CSRF attacks
    })
);
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('public', express.static(__dirname + '/public'));

const RATE_LIMIT = 100; // requests
const WINDOW = 60; // seconds

app.use(async (req: Request, res: Response, next: NextFunction) => {
    const key: RedisKey = `rate:${req.ip}`;
    const count = await redis.incr(key);
    console.log(`*****${key} => ${count}******`);

    if (count === 1) await redis.expire(key, WINDOW);
    if (count > RATE_LIMIT)
        return res.status(429).send({ message: 'Too many requests' }) as any

    next()
})


// Define a simple health check route
app.get('/api/v1/user/health', (req: Request, res: Response) => {
    res.status(200).send({
        message: 'auth service works fine!!!!',
        status: 200,
        error: null,
    });
});
// curl http://ticketing.dev/api/v1/user/health

app.use('/api/v1', apiRouter);






export default app;