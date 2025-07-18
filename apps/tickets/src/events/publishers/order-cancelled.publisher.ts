import Publisher from "../../utils/nats/events/base-publisher";
import { Subjects } from "../../utils/nats/events/subjects-queuegrpnames.enum";
import { OrderCancelledEvent } from "../../utils/nats/events/order.events";


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}