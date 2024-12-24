import { expect } from 'chai';
import request from 'supertest';
import { app } from '../index';  // Remove .js extension
import { before } from 'node:test';

describe('Help Request API', () => {
  let authToken: string;

  before(async () => {
    // Login to get auth token
    const response = await request(app)
      .post('/api/login')
      .send({ user: 'testuser', password: 'password123' });
    authToken = response.body.token;
  });

  it('should create a help request', async () => {
    const response = await request(app)
      .post('/api/help_requests')
      .send({
        mom_id: 1,
        mom_name: 'Test Mom',
        category: 'Test Category',
        request: 'Test Request'
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
  });

  it('should get all help requests', async () => {
    const response = await request(app)
      .get('/api/help_requests')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('Requests');
    expect(response.body.Requests).to.be.an('array');
  });
});