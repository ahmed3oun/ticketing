import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Order from '../../models/order.model';
import Ticket from '../../models/ticket.model';
import { natsWrapper } from '../../utils/nats/nats.wrapper';
import { OrderStatus } from '../../utils/nats/types/order-status.enum';

it('returns an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', global.signin())
        .send({ ticketId })
        .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        price: 20,
        title: "Cinema",
        userId
    });
    await ticket.save();
    const order = Order.build({
        ticket,
        userId,
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(400);
});

it('reserves a ticket', async () => {
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);
});

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', global.signin())
        .send({ ticketId: ticket.id })
        .expect(201);

    expect(natsWrapper.client!.publish).toHaveBeenCalled();
});
