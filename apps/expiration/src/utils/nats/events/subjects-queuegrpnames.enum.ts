export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',

  ExpirationComplete = 'expiration:complete',

  PaymentCreated = 'payment:created',
}

export enum QueueGroupNames {
  TicketsService = 'tickets-service',
  ExpirationService = 'expiration-service',
  PaymentsService = 'payments-service',
}