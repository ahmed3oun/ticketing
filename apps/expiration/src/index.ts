import { OrderCreatedListener } from "./events/listeners/order-created.listener";
import configService from "./utils/config/config-service";
import { natsWrapper } from "./utils/nats/nats.wrapper";

const start = async () => {
    console.log('Starting Expiration Service....');
    // Load configuration
    const REDIS_HOST = configService.getOrElseThrow('REDIS_HOST');
    const NATS_CLIENT_ID = configService.getOrElseThrow('NATS_CLIENT_ID');
    const NATS_URL = configService.getOrElseThrow('NATS_URL');
    const NATS_CLUSTER_ID = configService.getOrElseThrow('NATS_CLUSTER_ID');

    // Connect to NATS
    await natsWrapper.connect(NATS_CLUSTER_ID, NATS_CLIENT_ID, NATS_URL);

    natsWrapper.client!.on('close', () => {
        console.log('NATS connection closed');
        process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client!.close());
    process.on('SIGTERM', () => natsWrapper.client!.close());

    new OrderCreatedListener(natsWrapper.client).listen();
}

start().catch((error) => {
    console.error("Error starting the application:", error);
    process.exit(1);
});

