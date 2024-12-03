const request = require('supertest')
import { expect } from 'chai';
import { app } from '../index';

describe('User Routes', () => {

  afterEach((done) => {
    done();
  });

  // Test GET /api/users route
  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).to.equal(201);
    expect(res.body).to.be.an('array');
    console.log(res.body)
  });

  // Test POST /api/users route
  it('should allow access to add a user if authenticated', async () => {
    const root = { user: 'rootuser', password: 'rootpass' };
    const loginRes = await request(app)
      .post('/api/login')
      .send(root);
    expect(loginRes.status).to.equal(201);
    expect(loginRes.body).to.have.property('message').that.equals('Login successful');

    const cookies = loginRes.headers['set-cookie'];
  
    const user = { user: 'testuser', password: 'testpassword' };
    const res = await request(app)
      .post('/api/users')
      .set('Cookie', cookies)
      .send(user);
  
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').that.includes('User testuser added');
  });

  it('should not allow access to add a user if not authenticated', async () => {
    const user = { user: 'testuser', password: 'testpassword' };
    const res = await request(app)
      .post('/api/users')
      .send(user);
    expect(res.status).to.equal(401);
    expect(res.body).to.have.property('message').that.includes('Unauthorized');
  });

  it('should log in an existing user', async () => {
    const user = { user: 'testuser', password: 'testpassword' };  // Use the user we created in before hook
    const res = await request(app)
      .post('/api/login')
      .send(user);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message').that.equals('Login successful');
  });

  it('should delete an existing user', async () => {
    const res = await request(app)
      .delete('/api/users/testuser')
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message').that.equals('User testuser deleted');
  });
});