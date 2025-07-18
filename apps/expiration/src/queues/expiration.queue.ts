import Queue, { Job } from "bull"
import configService from '../utils/config/config-service';
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete.publisher";
import { natsWrapper } from "../utils/nats/nats.wrapper";


interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: configService.getOrElseThrow('REDIS_HOST')
    }
})

expirationQueue.process(async (job: Job<Payload>) => {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
})

export { expirationQueue };