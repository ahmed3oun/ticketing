import Publisher from "../../utils/nats/events/base-publisher";
import { Subjects } from "../../utils/nats/events/subjects-queuegrpnames.enum";
import { TicketCreatedEvent } from "../../utils/nats/events/ticket.events";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}