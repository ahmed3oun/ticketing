import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
<<<<<<< HEAD
import Ticket from '../../models/ticket.model';
=======
import Ticket from '@/models/ticket.model';
>>>>>>> 9db7e17 (updtate project arch and complete tickets feature with its unit tests: tickets ms and upd infra)


it('returns a 404 if the provided id does not belong to a ticket', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/v1/tickets/update/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'aslkdfj',
            price: 20
        })
        .expect(404);
})

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/v1/tickets/update/${id}`)
        .send({
            title: 'aslkdfj',
            price: 20,
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/v1/tickets/create')
        .set('Cookie', global.signin())
        .send({
            title: 'Theatro',
            price: 20,
        });

    await request(app)
        .put(`/api/v1/tickets/update/${response.body.data.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Theatro Updated',
            price: 1000,
        })
        .expect(403);
    // 403 stands for Forbidden that means the user is not authorized to perform this action
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/v1/tickets/create')
        .set('Cookie', cookie)
        .send({
            title: 'Concert',
            price: 20,
        });

    await request(app)
        .put(`/api/v1/tickets/update/${response.body.data.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20,
        })
        .expect(400);

    await request(app)
        .put(`/api/v1/tickets/update/${response.body.data.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'alskdfjj',
            price: -10,
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/v1/tickets/create')
        .set('Cookie', cookie)
        .send({
            title: 'Circus',
            price: 20,
        });

    await request(app)
        .put(`/api/v1/tickets/update/${response.body.data.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100,
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/v1/tickets/find/${response.body.data.id}`)
        .set('Cookie', cookie)
        .send();

    expect(ticketResponse.body.data.title).toEqual('new title');
    expect(ticketResponse.body.data.price).toEqual(100);
});

it('rejects updates if the ticket is reserved', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/v1/tickets/create')
        .set('Cookie', cookie)
        .send({
            title: 'Football Match',
            price: 35,
        });

    const ticket = await Ticket.findById(response.body.data.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
        .put(`/api/v1/tickets/update/${response.body.data.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100,
        })
        .expect(400);
});