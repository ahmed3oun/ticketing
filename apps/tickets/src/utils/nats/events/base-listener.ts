import { Message, Stan } from "node-nats-streaming";
import { QueueGroupNames, Subjects } from "./subjects-queuegrpnames.enum";

interface IEvent {
    subject: Subjects;
    data: any;
}

export abstract class Listener<T extends IEvent> {
    abstract subject: T['subject'];
    abstract queueGroupName: QueueGroupNames;
    abstract onMessage(data: T['data'], msg: Message): void;
    protected ackWait = 5 * 1000; // 5 seconds
    protected client: Stan; // Replace with actual NATS client type if available

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client.subscriptionOptions()
            .setDeliverAllAvailable() // Start from the beginning of the stream
            .setManualAckMode(true) // Manual acknowledgment mode
            .setAckWait(this.ackWait) // Acknowledge wait time
            .setDurableName(this.queueGroupName) // Durable subscription name
    }

    listen() : void {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subscriptionOptions()
        )

        subscription.on('message', (msg: Message) => {
            console.log(`Message received: ${this.subject} / ${this.queueGroupName} / ${msg.getSequence()}`);
            const parsedData = this.parseMessage(msg);

            try {
                this.onMessage(parsedData, msg);
            } catch (error) {
                console.error('Error processing message:', error);
                throw new Error("Failed to process message");
            }
        })
    }

    private parseMessage(msg: Message): T['data'] {
        try {
            const data = msg.getData();
            if (typeof data === 'string') {
                return JSON.parse(data) as T['data'];
            } else if (data instanceof Buffer) {
                return JSON.parse(data.toString()) as T['data'];
            } else {
                throw new Error('Unknown message data type');
            }
        } catch (error) {
            console.error('Error parsing message data:', error);
            throw new Error('Failed to parse message data');
        }
    }
}