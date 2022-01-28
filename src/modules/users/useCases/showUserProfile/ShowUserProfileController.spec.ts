import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { app } from '../../../../app';

let connection: Connection;
describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('12345', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'user', 'user@gmail.com', '${password}', 'now()', 'now()')
      `
    )
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it ('Shouldbe able to show user profile', async () => {
    const responseToken = await request(app).post('/api/v1/sessions').send({
      email: 'user@gmail.com',
      password: '12345'
    });

    const { token } = responseToken.body;

    const response = await request(app).get('/api/v1/profile')
    .set({
      Authorization: `Baerer ${token}`
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toEqual('user')

  })
})

