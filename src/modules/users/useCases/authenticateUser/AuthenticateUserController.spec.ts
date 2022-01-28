import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { app } from '../../../../app';

let connection: Connection;
describe('User Authenticate', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash('12345', 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}', 'user', 'user@gmail.com', '${password}', 'now()', 'now()')
      `
    );
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('Should be able to create session user', async () => {
    const response = await request(app).post('/api/v1/sessions').send({
      email: 'user@gmail.com',
      password: '12345'
    });

    console.log(response.body)

    expect(response.status).toBe(200);
    expect(response.body.user).toHaveProperty('id')
    expect(response.body).toHaveProperty('token')
    expect(response.body.user.name).toEqual('user')
  })
})
