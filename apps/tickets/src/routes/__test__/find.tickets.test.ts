import request from 'supertest';
import app from '../../app';
import mongoose, { set } from 'mongoose';


const createTicket = async (title: string, price: number, cookie: string) => {

    const response = await request(app)
        .post('/api/v1/tickets/create')
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        .expect(201);

    return response.body.data;
}

it('can fetch a list of tickets', async () => {
    const cookie = global.signin();
    await createTicket('Concert', 20, cookie);
    await createTicket('Cinema', 15, cookie);
    await createTicket('Theater', 30, cookie);

    const response = await request(app)
        .get('/api/v1/tickets/find')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.data.length).toEqual(3);
    expect(response.body.data[0].title).toEqual('Concert');
    expect(response.body.data[0].price).toEqual(20);
    expect(response.body.data[1].title).toEqual('Cinema');
    expect(response.body.data[1].price).toEqual(15);
    expect(response.body.data[2].title).toEqual('Theater');
    expect(response.body.data[2].price).toEqual(30);
})

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin();
    await request(app)
        .get(`/api/v1/tickets/find/${id}`)
        .set('Cookie', cookie)
        .send()
        .expect(404);
});


it('returns 200 if the ticket is found', async () => {
    const title = 'Concert'
    const price = 20;
    const cookie = global.signin();
    const ticket = await createTicket(title, price, cookie);

    const res = await request(app)
        .get(`/api/v1/tickets/find/${ticket.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(ticket.title).toEqual(res.body.data.title);
    expect(ticket.price).toEqual(res.body.data.price);
    expect(ticket.id).toEqual(res.body.data.id);
    expect(ticket.userId).toEqual(res.body.data.userId);
})

