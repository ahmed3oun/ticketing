import Publisher from "../../utils/nats/events/base-publisher";
import { Subjects } from "../../utils/nats/events/subjects-queuegrpnames.enum";
import { OrderCreatedEvent } from "../../utils/nats/events/order.events";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}