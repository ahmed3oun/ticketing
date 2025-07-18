import request from 'supertest';
import app from '../../app';

it('responds with details about the current user', async () => {
    const cookie = await global.signin();
    console.log(`************* ====== Cookie: ${cookie}`); // Debugging line to check the cookie value


    const response = await request(app)
        .get('/api/v1/user/get-current-user')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with 401 if not authenticated', async () => {
    const response = await request(app)
        .get('/api/v1/user/get-current-user')
        .send()
        .expect(401);

    expect(response.body.message).toEqual('Not authenticated');
});
