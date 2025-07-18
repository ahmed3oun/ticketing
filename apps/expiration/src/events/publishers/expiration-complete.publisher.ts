import Publisher from '@/utils/nats/events/base-publisher';
import { ExpirationCompleteEvent } from '../../utils/nats/events/expiration.events';
import { Subjects } from '@/utils/nats/events/subjects-queuegrpnames.enum';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}