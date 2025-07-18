import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket.model';
import { OrderDoc } from '../../models/order.model';

const buildTicket = async (title?: string, price?: number) => {
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: title || 'Concert',
        price: price || 20,
    });
    await ticket.save();

    return ticket;
};

it('fetches the order', async () => {
    // Create a ticket
    const ticket = await buildTicket()

    const user = global.signin();
    // make a request to build an order with this ticket
    const response = await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);
    const order = response.body.data as OrderDoc

    // make request to fetch the order
    const resp = await request(app)
        .get(`/api/v1/orders/find/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(resp.body.data.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another users order', async () => {
    // Create a ticket
    const ticket = await buildTicket();

    const user1 = global.signin();
    // make a request to build an order with this ticket
    const resPost = await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', user1)
        .send({ ticketId: ticket.id })
        .expect(201);
    const order = resPost.body.data as OrderDoc

    const user2 = global.signin()
    // make request to fetch the order
    await request(app)
        .get(`/api/v1/orders/find/${order.id}`)
        .set('Cookie', user2)
        .send()
        .expect(401);
});



it('fetches orders for an particular user', async () => {
    // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket("Cinema", 25);
    const ticketThree = await buildTicket("Footbal", 30);

    const userOne = global.signin();
    const userTwo = global.signin();
    // Create one order as User #1
    await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201);

    // Create two orders as User #2
    const { body: bodyO1 } = await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201);
    const orderOne = bodyO1.data

    const { body: bodyO2 } = await request(app)
        .post('/api/v1/orders/create')
        .set('Cookie', userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201);
    const orderTwo = bodyO2.data

    // Make request to get orders for User #2
    const response = await request(app)
        .get('/api/v1/orders/find')
        .set('Cookie', userTwo)
        .expect(200);

    // Make sure we only got the orders for User #2
    expect(response.body.data.length).toEqual(2);
    expect(response.body.data[0].id).toEqual(orderOne.id);
    expect(response.body.data[1].id).toEqual(orderTwo.id);
    expect(response.body.data[0].ticket.id).toEqual(ticketTwo.id);
    expect(response.body.data[1].ticket.id).toEqual(ticketThree.id);
});
