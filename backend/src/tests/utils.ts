import { app } from '../index'
import { createUser } from '../models/userModel'
import request from 'supertest'

export async function loginAsAdmin(adminUsername: string) {
  await createAdminUser(adminUsername)
  const response = await request(app).post('/api/login').send({
    username: adminUsername,
    password: 'password',
  })
  return { cookie: response.headers['set-cookie'], id: response.body.id }
}

export async function loginAsMom(momUsername: string) {
  await createMomUser(momUsername)
  const response = await request(app).post('/api/login').send({
    username: momUsername,
    password: 'password',
  })
  return { cookie: response.headers['set-cookie'], id: response.body.id }
}

export async function loginAsVolunteer(volunteerUsername: string) {
  await createVolunteerUser(volunteerUsername)
  const response = await request(app).post('/api/login').send({
    username: volunteerUsername,
    password: 'password',
  })
  return { cookie: response.headers['set-cookie'], id: response.body.id }
}

export async function createAdminUser(username: string) {
  const userData = await createUser(
    username,
    'password',
    'Admin',
    'Admin',
    'Admin',
    'https://example.com/profile.jpg',
  )
  return userData
}
export async function createMomUser(username: string) {
  const userData = await createUser(
    username,
    'password',
    'Mom',
    'Mom',
    'Mom',
    'https://example.com/profile.jpg',
  )
  return userData
}
export async function createVolunteerUser(username: string) {
  const userData = await createUser(
    username,
    'password',
    'Test',
    'Volunteer',
    'Volunteer',
    'https://example.com/profile.jpg',
  )
  return userData
}
