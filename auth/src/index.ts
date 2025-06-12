import app from "./app"
import configService from "./utils/config/config-service";
// import connectDatabase from "./utils/database/connect-database";

const start = async () => {
    console.log('Starting Auth Service...');
    
    // const PORT = configService.getOrElseThrow('PORT');
    //const JWT_KEY = configService.getOrElseThrow('JWT_KEY');
    //const JWT_EXPIRES_TIME = configService.getOrElseThrow('JWT_EXPIRES_TIME');

    //await connectDatabase();

    app.listen(3000, () => {
        console.log(`Auth service is running on port 3000`);
    });

}

start().catch((error) => {
    console.error("Error starting the application:", error);
    process.exit(1);
});

