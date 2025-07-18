import { Message } from "node-nats-streaming";
import { Listener } from "../../utils/nats/events/base-listener";
import { OrderCreatedEvent } from "../../utils/nats/events/order.events";
import { QueueGroupNames, Subjects } from "../../utils/nats/events/subjects-queuegrpnames.enum";
import { expirationQueue } from "../../queues/expiration.queue";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = QueueGroupNames.ExpirationService;

    /**
     * This method is called when an OrderCreatedEvent is received.
     * It should contain the logic to handle the event, such as updating the order status in the database.
     * 
     * @param data - The data from the OrderCreatedEvent.
     * @param msg - The message object from NATS Streaming.
     */
    onMessage(data: OrderCreatedEvent['data'], msg: Message): void {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log('Waiting this many milliseconds to process the job: ', delay);

        expirationQueue.add(
            {
                orderId: data.id
            },
            {
                delay
            }
        );

        msg.ack()
    }
}