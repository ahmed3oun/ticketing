import { Subjects } from "./subjects-queuegrpnames.enum";


export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
