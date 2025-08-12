import { recreateTables } from '../config/database'
import { app, httpServer } from '../index'
import request from 'supertest'
import { interval } from '../notifications/notifications'
import { createChat, createMessage, getMessageData } from '../models/chatsModel'
import {
  createMomUser,
  createVolunteerUser,
  loginAsAdmin,
  loginAsMom,
  loginAsVolunteer,
} from './utils'
import { log } from 'console'
beforeEach(async () => {
  await recreateTables()
})

afterAll(async () => {
  await httpServer.close()
  clearInterval(interval)
})
async function setupChats() {
  const momData1 = await loginAsMom('Mom1')
  const momData2 = await createMomUser('Mom2')
  const volunteerData1 = await createVolunteerUser('Volunteer1')
  const volunteerData2 = await createVolunteerUser('Volunteer2')
  await createChat(volunteerData1.id, momData1.id)
  await createChat(volunteerData2.id, momData2.id)
  await createChat(volunteerData1.id, momData2.id)
  await createChat(volunteerData2.id, momData1.id)
  return { momData1, momData2, volunteerData1, volunteerData2 }
}

async function setupMessages() {
  const momData1 = await loginAsMom('Mom1')
  const volunteerData1 = await createVolunteerUser('Volunteer1')
  const chatId = await createChat(volunteerData1.id, momData1.id)
  await createMessage(chatId, momData1.id, 'Message1', '2021-01-01')
  await createMessage(chatId, volunteerData1.id, 'Message2', '2021-01-02')
  await createMessage(chatId, momData1.id, 'Message3', '2021-01-03')
  return {
    momCookie: momData1.cookie,
    momId: momData1.id,
    volunteerId: volunteerData1.id,
    chatId,
  }
}

describe('Chat Routes', () => {
  describe('Get all chats', () => {
    test('should return all chats', async () => {
      await setupChats()
      const adminData = await loginAsAdmin('Admin')
      const response = await request(app)
        .get('/api/chats/all')
        .set('Cookie', adminData.cookie)
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(4)
    })

    test('user that is not admin should not be able to get all chats', async () => {
      const momData = await loginAsMom('Mom1')
      const response = await request(app)
        .get('/api/chats/all')
        .set('Cookie', momData.cookie)
      expect(response.status).toBe(401)
    })
  })

  describe('Get messages', () => {
    test('should return messages', async () => {
      const { momCookie, volunteerId, chatId } = await setupMessages()
      const response = await request(app)
        .get(`/api/chats/${chatId}/`)
        .set('Cookie', momCookie)
      expect(response.status).toBe(200)
      expect(response.body.messages.length).toBe(3)
    })

    test('user that is not part of the chat should not be able to get messages', async () => {
      const { momCookie, volunteerId, chatId } = await setupMessages()
      const volunteerData = await loginAsVolunteer('Volunteer2')
      const response = await request(app)
        .get(`/api/chats/${chatId}/`)
        .set('Cookie', volunteerData.cookie)
      expect(response.status).toBe(400)
    })
  })

  describe('Get chat info', () => {
    test('should return chat info', async () => {
      const { momCookie, volunteerId, chatId } = await setupMessages()
      const response = await request(app)
        .get(`/api/chats/${chatId}/info`)
        .set('Cookie', momCookie)
      expect(response.status).toBe(200)
      expect(response.body.id).toBe(chatId)
    })
  })

  describe('Send message', () => {
    test('should send message', async () => {
      const { momCookie, volunteerId, chatId } = await setupMessages()
      const response = await request(app)
        .post(`/api/chats`)
        .set('Cookie', momCookie)
        .send({
          chatId,
          senderId: volunteerId,
          message: 'Test message',
        })
      expect(response.status).toBe(201)
      expect(response.body.message).toBe('Message sent')
      const messages = await getMessageData(chatId)
      expect(messages.length).toBe(4)
    })
  })

  describe('Get user chats', () => {
    test('should return user chats', async () => {
      const { momData1 } = await setupChats()
      const response = await request(app)
        .get(`/api/chats`)
        .set('Cookie', momData1.cookie)
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(2)
    })
  })

  describe('Get messages by chat id', () => {
    test('should return messages by chat id', async () => {
      const { momCookie, volunteerId, chatId } = await setupMessages()
      const response = await request(app)
        .get(`/api/chats/${chatId}/messages`)
        .set('Cookie', momCookie)
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(3)
    })
  })
})
