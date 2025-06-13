import app from "../../app";
import request from "supertest";

it('expect to signout successfully with no cookie to return 204', async () => {
    await request(app)
        .post('/api/v1/user/register')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/v1/user/logout')
        .send({})
        .expect(204);

    expect(response.get("Set-Cookie")![0]).toEqual(
        "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly"
    );
}
);