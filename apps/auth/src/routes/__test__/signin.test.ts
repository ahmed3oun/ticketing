import request from 'supertest';
import app from '../../app';


it('Fails when an email that does not exist is supplied', async () => {
    request(app)
        .post('/api/v1/user/login')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(400)
})

it('Fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/v1/user/register')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(201);

    await request(app)
        .post('/api/v1/user/login')
        .send({
            email: 'test@test.com',
            password: 'wrongpassword'
        })
        .expect(400);
});

it('Responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/v1/user/register')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/v1/user/login')
        .send({
            email: 'test@test.com',
            password: 'password123'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
})