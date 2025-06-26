import app from "./app"
import { OrderCancelledListener } from "./events/listeners/order-cancelled.listener";
import { OrderCreatedListener } from "./events/listeners/order-created.listener";
import configService from "./utils/config/config-service";
import connectDatabase from "./utils/database/connect-database";
import { natsWrapper } from "./utils/nats/nats.wrapper";

const start = async () => {
    console.log('Starting Tickets Service....');
    // Load configuration
    const PORT = configService.getOrElseThrow('PORT');
    const NATS_CLIENT_ID = configService.getOrElseThrow('NATS_CLIENT_ID');
    const NATS_URL = configService.getOrElseThrow('NATS_URL');
    const NATS_CLUSTER_ID = configService.getOrElseThrow('NATS_CLUSTER_ID');
    const MONGO_URI = configService.getOrElseThrow('MONGO_URI');
    const JWT_KEY = configService.getOrElseThrow('JWT_KEY');
    //const JWT_EXPIRES_TIME = configService.getOrElseThrow('JWT_EXPIRES_TIME');

    // Connect to NATS
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

    natsWrapper.client!.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client!.close());
    process.on('SIGTERM', () => natsWrapper.client!.close());

    new OrderCreatedListener(natsWrapper.client!).listen();
    new OrderCancelledListener(natsWrapper.client!).listen();

    // Connect to MongoDB
    await connectDatabase(MONGO_URI);


    app.listen(PORT, () => {
        console.log(`Tickets service is running on port ${PORT}`);
    });

}

start().catch((error) => {
    console.error("Error starting the application:", error);
    process.exit(1);
});

