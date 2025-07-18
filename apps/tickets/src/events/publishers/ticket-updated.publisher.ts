import Publisher from "../../utils/nats/events/base-publisher";
import { TicketUpdatedEvent } from "../../utils/nats/events/ticket.events";
import { Subjects } from "../../utils/nats/events/subjects-queuegrpnames.enum";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}