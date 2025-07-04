import mongoose from 'mongoose';
import configService from '../config/config-service';
import ErrorHandler from '../errors/error-handler';
const connectDatabase = async (MONGO_URI: string) => {
    if (configService.get('NODE_ENV') === 'test') {
        return;
    }

    try {
        const conn = await mongoose.connect(MONGO_URI, {
            authMechanism: 'DEFAULT',
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw new ErrorHandler('Error connecting to MongoDB', 500);
    }
}
export default connectDatabase;