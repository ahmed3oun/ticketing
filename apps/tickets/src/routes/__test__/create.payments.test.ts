
import mongoose from "mongoose";
import app from "../../app"
import request from "supertest";
import Order from "../../models/order.model";
import { OrderStatus } from "../../utils/nats/types/order-status.enum";
import Ticket from "../../models/ticket.model";
import stripe from "../../utils/stripe/stripe.wrapper";
import Payment from "../../models/payment.model";


it('Returns 404 when purchasing an order that does\'nt exists', async () => {
    await request(app).
        post('/api/v1/payments/create')
        .set('Cookie', global.signin())
        .send({
            orderId: new mongoose.Types.ObjectId().toHexString(),
            token: 'tok_visa'
        })
        .expect(404);
})

it('returns a 403 when purchasing an order that doesnt belong to the user', async () => {
    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiresAt: new Date(new Date().getSeconds() + 60) // 1 minute from now
    })
    await order.save();

    await request(app)
        .post('/api/v1/payments/create')
        .set('Cookie', global.signin())
        .send({
            orderId: order.id,
            token: 'aerfgh'
        })
        .expect(403);
})

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        userId,
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId,
        status: OrderStatus.Cancelled,
        expiresAt: new Date(new Date().getSeconds() + 60)
    })
    await order.save();
    await request(app)
        .post('/api/v1/payments/create')
        .set('Cookie', global.signin(userId))
        .send({
            orderId: order.id,
            token: 'asdlkfj',
        })
        .expect(400);
});

it('returns a 201 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = 20;

    const ticket = Ticket.build({
        userId,
        title: 'concert',
        price,
    });
    await ticket.save();

    const order = Order.build({
        ticket,
        userId,
        status: OrderStatus.Created,
        expiresAt: new Date(new Date().getSeconds() + 60)
    })
    await order.save();

    await request(app)
        .post('/api/v1/payments/create')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id,
        })
        .expect(201);

    const stripeCharges = await stripe.charges.list({ limit: 50 });
    console.log({
        data: stripeCharges.data
    });

    const stripeCharge = stripeCharges.data.find((charge) => charge.amount === price * 100);

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');

    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: stripeCharge!.id
    });
    expect(payment).not.toBeNull();
});