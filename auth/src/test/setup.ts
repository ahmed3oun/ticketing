import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';

declare global {
    var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
    console.log('Setting up in-memory MongoDB for tests...');

    process.env.JWT_KEY = 'xsdflkjqwe1234';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Disable TLS certificate validation for testing

    console.log(`JWT_KEY: ${process.env.JWT_KEY}`);
    console.log(`NODE_TLS_REJECT_UNAUTHORIZED: ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);

    // mongo = new MongoMemoryServer();
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
    const collections = await mongoose.connection.db!.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


global.signin = async () => {
    const email = 'test@test.com';
    const password = 'password123';

    const response = await request(app)
        .post('/api/v1/user/register')
        .send({ email, password })
        .expect(201);
    const cookie = response.get('Set-Cookie');
    if (!cookie) {
        throw new Error('No cookie found in response');
    }
    console.log('User registered and cookie received:', cookie);

    return cookie;
}

