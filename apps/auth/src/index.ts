import app from "./app"
import configService from "./utils/config/config-service";
import connectDatabase from "./utils/database/connect-database";

const start = async () => {
    console.log('Starting Auth Service....');
    // Load configuration
    const PORT = configService.getOrElseThrow('PORT');



    // const MONGO_URI = configService.getOrElseThrow('MONGO_URI');
    // const JWT_KEY = configService.getOrElseThrow('JWT_KEY');
    //const JWT_EXPIRES_TIME = configService.getOrElseThrow('JWT_EXPIRES_TIME');

    await connectDatabase();

    app.listen(PORT, () => {
        console.log(`Auth service is running on port ${PORT}`);
    });

}

start().catch((error) => {
    console.error("Error starting the application:", error);
    process.exit(1);
});

