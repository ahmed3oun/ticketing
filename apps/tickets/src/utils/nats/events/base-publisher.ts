import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects-queuegrpnames.enum";

interface IEvent {
    subject: Subjects;
    data: any;
}


export default abstract class Publisher<T extends IEvent> {
    abstract subject: T['subject'];
    protected client: Stan; // Replace with actual NATS client type if available

    constructor(client: Stan) {
        this.client = client;
    }

    async publish(data: T['data']): Promise<void> {
        return new Promise((resolve, reject) => {
            const stringifiedData = this.stringifyData(data);
            console.log({
                stringifiedData,
                client: this.client
            });

            this.client.publish(this.subject, stringifiedData, (err) => {
                if (err) {
                    console.error(`Error publishing event ${this.subject}:`, err);
                    return reject(err);
                }
                console.log(`Event published to subject ${this.subject}:`, stringifiedData);
                resolve();
            })
        })
    }

    private stringifyData(data: T['data']): string {
        try {
            return JSON.stringify(data);
        } catch (error) {
            console.error('Error stringifying data:', error);
            throw new Error('Failed to stringify data');
        }
    }
}