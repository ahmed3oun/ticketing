import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket.model';
import Order from '../../models/order.model';
import { OrderStatus } from '../../utils/nats/types/order-status.enum';
import { natsWrapper } from '../../utils/nats/nats.wrapper';


const buildTicket = async (title?: string, price?: number) => {
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: title || 'Concert',
        price: price || 20,
    });
    await ticket.save();

    return ticket;
};

it('marks an order as cancelled', async () => {
    // create a ticket with Ticket Model
    const ticket = await buildTicket()

    const user = global.signin();
    // make a request to create an order
    const { body: bodyO } = await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/v1/orders/delete/${bodyO.data.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    // expectation to make sure the thing is cancelled
    const updatedOrder = await Order.findById(bodyO.data.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits a order cancelled event', async () => {
    const ticket = await buildTicket()

    const user = global.signin();
    // make a request to create an order
    const { body: order } = await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    // make a request to cancel the order
    await request(app)
        .delete(`/api/v1/orders/delete/${order.data.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
