
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import configService from '../utils/config/config-service';

declare global {
    var signin: (userId?: string) => string;
}

jest.mock('../utils/nats/nats.wrapper');
jest.mock('../utils/stripe/stripe.wrapper')

let mongo: any;
beforeAll(async () => {
    console.log('*********Setting up in-memory MongoDB for tests*********');

    process.env.JWT_KEY = 'xsdflkjqwe1234';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable TLS certificate validation for testing

    configService.loadConfig();
    console.log('Config loaded:',
        configService.get('JWT_KEY'),
        configService.get('NODE_TLS_REJECT_UNAUTHORIZED'),
        configService.get('STRIPE_KEY')
    );

    mongo = await MongoMemoryServer.create({
        instance: {
            dbName: 'testdb',
        },
    });
    const mongoUri = mongo.getUri();
    console.log('MongoDB URI:', mongoUri);

    await mongoose.connect(mongoUri, {});
    console.log('Connected to MongoDB in memory');
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db!.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = (userId?: string) => {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: userId || new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    // Create the JWT!
    const token = jwt.sign(payload, configService.getOrElseThrow('JWT_KEY'));

    // Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const BASE64_ENCODED_SESSION = Buffer.from(sessionJSON).toString('base64');
    //const _cookie = 'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalk0TmpReU1tUmtNelF4TW1FeU5XRTJaamc0WXpRek5TSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRjMU1UTTVNams0T1gwLnFzX3loOXMtMkdmRDJiRHBlVkgteVZ3SXczVGRDV3JVc2dZWEw3QnRoQmsifQ==; path=/; samesite=strict; httponly'
    // return a string thats the cookie with the encoded data
    return `session=${BASE64_ENCODED_SESSION}; path=/; samesite=strict; httponly`;
};
