import { createUser, getAllUsers } from '../models/userModel'
import { app, httpServer } from '../index'
import request from 'supertest'
import path from 'path'
import fs from 'fs'
import { interval } from '../notifications/notifications'
import { loginAsAdmin, loginAsMom } from './utils'
import { createTables, deleteFromTables } from '../config/database'
import { log } from 'console'

beforeAll(async () => {
  await createTables()
})
afterEach(async () => {
  await deleteFromTables()
})
afterAll(async () => {
  await httpServer.close()
  clearInterval(interval)
})

// Helper function to create a test image
function createTestImage(): string {
  const testImagePath = path.join(
    __dirname,
    '../../public/images/test-image.jpg',
  )
  const testDir = path.dirname(testImagePath)

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }

  // Create a minimal JPEG file
  const jpegHeader = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
  ])
  fs.writeFileSync(testImagePath, jpegHeader)
  return testImagePath
}

describe('Test getting all users endpoint', () => {
  test('Should return all users with admin role', async () => {
    const adminData = await loginAsAdmin('Admin')
    const response = await request(app)
      .get('/api/users')
      .set('Cookie', adminData.cookie)
    expect(response.status).toBe(201)
    expect(response.body.users.length).toBe(1)
  })
  test('Access denied for mom', async () => {
    const momData = await loginAsMom('Mom')
    const response = await request(app)
      .get('/api/users')
      .set('Cookie', momData.cookie)
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Unauthorized')
  })
})

describe('Test getting user endpoint', () => {
  test('Should return user with admin role', async () => {
    const adminData = await loginAsAdmin('Admin')
    const response = await request(app)
      .get('/api/users/1')
      .set('Cookie', adminData.cookie)
    expect(response.status).toBe(201)
    expect(response.body.username).toBe('Admin')
  })
  test('Access denied for mom', async () => {
    const momData = await loginAsMom('Mom')
    const response = await request(app)
      .get('/api/users/1')
      .set('Cookie', momData.cookie)
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Unauthorized')
  })
})

describe('Test adding user endpoint', () => {
  test('Should add user with admin role', async () => {
    const adminData = await loginAsAdmin('Admin')
    const testImagePath = createTestImage()

    try {
      const response = await request(app)
        .post('/api/users')
        .set('Cookie', adminData.cookie)
        .field('username', 'TestUser')
        .field('password', 'password123')
        .field('firstName', 'Test')
        .field('lastName', 'User')
        .field('role', 'Admin')
        .attach('profilePic', testImagePath)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('User TestUser added')
    } finally {
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath)
      }
    }
  })
  test('Should reject user with existing username', async () => {
    const adminData = await loginAsAdmin('Admin')
    const testImagePath = createTestImage()

    const response = await request(app)
      .post('/api/users')
      .set('Cookie', adminData.cookie)
      .field('username', 'Admin')
      .field('password', 'password')
      .field('firstName', 'Admin')
      .field('lastName', 'Admin')
      .field('role', 'Admin')
      .attach('profilePic', testImagePath)

    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath)
    }
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Username already exists')
  })
})

describe('Test login endpoint', () => {
  test('Should login successfully', async () => {
    const adminData = await loginAsAdmin('Admin')
    const response = await request(app).post('/api/login').send({
      username: 'Admin',
      password: 'password',
    })
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Login successful')
  })

  test('Should reject invalid credentials', async () => {
    const response = await request(app).post('/api/login').send({
      username: 'InvalidUser',
      password: 'wrongpassword',
    })
    expect(response.status).toBe(401)
    expect(response.body.message).toBe(
      'No account with username InvalidUser exists',
    )
  })
  test('Should reject invalid password', async () => {
    await createUser(
      'TestUser',
      'password',
      'Test',
      'User',
      'Volunteer',
      'https://example.com/profile.jpg',
    )
    const response = await request(app).post('/api/login').send({
      username: 'TestUser',
      password: 'wrongpassword',
    })
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Incorrect password')
  })
})

describe('Test logout endpoint', () => {
  test('Should logout successfully', async () => {
    const adminData = await loginAsAdmin('Admin')
    const response = await request(app)
      .post('/api/logout')
      .set('Cookie', adminData.cookie)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Logout successful')
  })
})

describe('Test delete user endpoint', () => {
  test('Should delete user with admin role', async () => {
    const adminData = await loginAsAdmin('Admin')
    const response = await request(app)
      .delete('/api/users/1')
      .set('Cookie', adminData.cookie)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('User 1 deleted')
  })

  test('Access denied for non-admin', async () => {
    const momData = await loginAsMom('Mom')
    const response = await request(app)
      .delete('/api/users/1')
      .set('Cookie', momData.cookie)
    expect(response.status).toBe(401)
  })
})

describe('Test edit user endpoint', () => {
  test('Should edit user with admin role', async () => {
    const adminData = await loginAsAdmin('Admin')
    const testImagePath = createTestImage()

    try {
      const response = await request(app)
        .put('/api/users/1')
        .set('Cookie', adminData.cookie)
        .field('username', 'UpdatedUser')
        .field('password', 'newpassword')
        .field('firstName', 'Updated')
        .field('lastName', 'User')
        .field('role', 'Volunteer')
        .attach('profilePic', testImagePath)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe('User UpdatedUser updated')
    } finally {
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath)
      }
    }
  })
})

describe('Test verify session endpoint', () => {
  test('Should verify valid session', async () => {
    const adminData = await loginAsAdmin('Admin')
    const response = await request(app)
      .post('/api/verify-session')
      .set('Cookie', adminData.cookie)
    expect(response.status).toBe(201)
    expect(response.body.message).toBe('Session verified')
  })

  test('Should reject invalid session', async () => {
    const response = await request(app).post('/api/verify-session')
    expect(response.status).toBe(401)
  })
})
