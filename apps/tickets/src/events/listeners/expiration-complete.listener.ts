import { Message } from "node-nats-streaming";
import { Listener } from "../../utils/nats/events/base-listener";
import { ExpirationCompleteEvent } from "../../utils/nats/events/order.events";
import { QueueGroupNames, Subjects } from "../../utils/nats/events/subjects-queuegrpnames.enum";
import Order from "../../models/order.model";
import { OrderStatus } from "../../utils/nats/types/order-status.enum";


export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    readonly queueGroupName = QueueGroupNames.TicketsService;

    /**
     * This method is called when an OrderCancelledEvent is received.
     * It should contain the logic to handle the event, such as updating the order status in the database.
     * 
     * @param data - The data from the OrderCancelledEvent.
     * @param msg - The message object from NATS Streaming.
     */
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found');
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cancelled,
        });
        await order.save();

        msg.ack();
    }

}