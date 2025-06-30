import request from 'supertest';
import app from '../../app';


const createTicket = async (title: string, price: number) => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/v1/tickets/create')
        .set('Cookie', cookie)
        .send({
            title,
            price
        })
        // .expect(201);

    return response.body.data;
}

it('can fetch a list of tickets', async () => {
    await createTicket('Concert', 20);
    await createTicket('Cinema', 15);
    await createTicket('Theater', 30);

    const response = await request(app)
        .get('/api/v1/tickets/find')
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