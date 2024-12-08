import { expect } from 'chai';
import { app } from '../index';
import nock from 'nock';
import { Express } from 'express';
const request = require('supertest');

describe('Help Request Routes', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should return all help requests', async () => {
    nock('http://localhost:3000')
      .get('/api/help_requests')
      .reply(200, { help_requests: [] });

    const res = await request(app).get('/api/help_requests');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('help_requests').that.is.an('array');
  });

  it('should return a help request by ID', async () => {
    nock('http://localhost:3000')
      .get('/api/help_requests/1')
      .reply(200, { help_request: {} });

    const res = await request(app).get('/api/help_requests/1');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('help_request').that.is.an('object');
  });

  it('should create a new help request', async () => {
    const newRequest = { mom_id: 1, title: 'New Request', description: 'Need help', status: 'pending' };
    nock('http://localhost:3000')
      .post('/api/help_requests', newRequest)
      .reply(201, { id: 1 });

    const res = await request(app)
      .post('/api/help_requests')
      .send(newRequest);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('should update an existing help request', async () => {
    const updates = { title: 'Updated Request', description: 'Updated description', status: 'completed' };
    nock('http://localhost:3000')
      .put('/api/help_requests/1', updates)
      .reply(200, { message: 'Help request updated successfully' });

    const res = await request(app)
      .put('/api/help_requests/1')
      .send(updates);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').that.equals('Help request updated successfully');
  });

  it('should delete a help request', async () => {
    nock('http://localhost:3000')
      .delete('/api/help_requests/1')
      .reply(200, { message: 'Help request deleted successfully' });

    const res = await request(app).delete('/api/help_requests/1');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').that.equals('Help request deleted successfully');
  });
});