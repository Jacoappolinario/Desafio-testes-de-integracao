import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../app';

let connection: Connection
describe('Create User Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('Should be able to create a new user', async () => {
    const response = await request(app).post('/api/v1/users').send({
      name: 'Teste User',
      email: 'teste@teste.com.br',
      password: '12345'
    });

    expect(response.status).toBe(201)
  })
})
