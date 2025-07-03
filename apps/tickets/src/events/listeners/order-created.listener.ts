import { Message } from "node-nats-streaming";
import { Listener } from "../../utils/nats/events/base-listener";
import { OrderCreatedEvent } from "../../utils/nats/events/order.events";
import { QueueGroupNames, Subjects } from "../../utils/nats/events/subjects-queuegrpnames.enum";


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = QueueGroupNames.TicketsService;

    /**
     * This method is called when an OrderCreatedEvent is received.
     * It should contain the logic to handle the event, such as updating the order status in the database.
     * 
     * @param data - The data from the OrderCreatedEvent.
     * @param msg - The message object from NATS Streaming.
     */
    onMessage(data: OrderCreatedEvent['data'], msg: Message): void {
        throw new Error("Method not implemented.");
    }
}