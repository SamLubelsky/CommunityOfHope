const request = require('supertest')
import { expect } from 'chai';
const app = require('./index.ts')

describe('User Routes', () => {

  // Test GET /api/users route
  it('should return all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  // Test POST /api/users route
  it('should add a new user', async () => {
    const user = { user: 'testuser', password: 'testpassword' };
    const res = await request(app)
      .post('/api/users')
      .send(user);
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message').that.includes('User testuser added');
  });

  it('should log in an existing user', async () => {
    const user = { user: 'testuser', password: 'testpassword' };  // Use the user we created in before hook
    const res = await request(app)
      .post('/api/login')
      .send(user);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('message').that.equals('Login successful');
  });

  it('should delete an existing user', async () => {
    const res = await request(app)
      .delete('/api/users/testuser')
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('message').that.equals('User testuser deleted');
  });
});
